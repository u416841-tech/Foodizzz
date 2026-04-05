const WhatsAppService = require('./whatsappService');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const WhatsAppOrder = require('../models/WhatsAppOrder');
const moment = require('moment-timezone');

class SimpleOrderBot {
  // Main message handler - keep it simple
  static async handleMessage(phoneNumber, messageBody) {
    try {
      const message = messageBody.toLowerCase().trim();
      // Processing message from user

      // Handle special commands
      if (message === 'menu' || message === 'list') {
        return await SimpleOrderBot.sendMenu(phoneNumber);
      }

      if (message.includes('track') || message.match(/^\d{8}-\d{3}$/)) {
        return await SimpleOrderBot.handleTracking(phoneNumber, message);
      }

      if (message === 'hi' || message === 'hello' || message === 'start') {
        return await SimpleOrderBot.sendWelcome(phoneNumber);
      }

      if (message === 'reset' || message === 'clear') {
        // Clear any pending orders
        await WhatsAppOrder.deleteMany({
          phoneNumber,
          status: { $in: ['pending_details', 'pending_payment'] }
        });
        return await WhatsAppService.sendMessage(phoneNumber, '🔄 All pending orders cleared. You can start fresh now!');
      }

      // Try to parse as order
      const orderItems = await SimpleOrderBot.parseSimpleOrder(message);
      if (orderItems.length > 0) {
        return await SimpleOrderBot.handleOrder(phoneNumber, orderItems);
      }

      // Default response
      return await SimpleOrderBot.sendHelp(phoneNumber);

    } catch (error) {
      console.error('Error in handleMessage:', error);
      await WhatsAppService.sendMessage(
        phoneNumber,
        '❌ Sorry, something went wrong. Type *menu* to see our dishes or *hi* to start over.'
      );
    }
  }

  // Simple order parsing - just look for numbers and dish names
  static async parseSimpleOrder(message) {
    try {
      const dishes = await Dish.find({ available: true });
      const orderItems = [];
      const words = message.toLowerCase().split(/\s+/);

      // Parsing order from message

      // Look for patterns like "2 pizza", "1 margherita", etc.
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const quantity = parseInt(word);

        if (!isNaN(quantity) && quantity > 0) {
          // Look for dish name in next few words
          for (let j = i + 1; j < Math.min(i + 4, words.length); j++) {
            const dishName = words.slice(i + 1, j + 1).join(' ');
            
            // Find matching dish (flexible matching)
            const matchingDish = dishes.find(dish => {
              const dishLower = dish.name.toLowerCase();
              return dishLower.includes(dishName) || 
                     dishName.includes(dishLower) ||
                     dishLower.includes(dishName.replace(/s$/, '')) || // handle plurals
                     SimpleOrderBot.fuzzyMatch(dishLower, dishName);
            });

            if (matchingDish) {
              // Found matching dish
              
              // Check if already in order
              const existing = orderItems.find(item => item.name === matchingDish.name);
              if (existing) {
                existing.quantity += quantity;
              } else {
                orderItems.push({
                  name: matchingDish.name,
                  quantity: quantity,
                  price: matchingDish.price
                });
              }
              break;
            }
          }
        }
      }

      // Also try without numbers (assume quantity 1)
      if (orderItems.length === 0) {
        for (const dish of dishes) {
          const dishLower = dish.name.toLowerCase();
          if (message.includes(dishLower) || 
              message.includes(dishLower.replace(/s$/, '')) ||
              SimpleOrderBot.fuzzyMatch(dishLower, message)) {
            
            // Found dish with default quantity
            orderItems.push({
              name: dish.name,
              quantity: 1,
              price: dish.price
            });
            break; // Only match first dish to avoid confusion
          }
        }
      }

      // Order parsing completed
      return orderItems;

    } catch (error) {
      console.error('Error parsing order:', error);
      return [];
    }
  }

  // Simple fuzzy matching
  static fuzzyMatch(dishName, userInput) {
    // Remove common words and check similarity
    const cleanDish = dishName.replace(/pizza|burger|coke|drink/g, '').trim();
    const cleanInput = userInput.replace(/pizza|burger|coke|drink/g, '').trim();
    
    if (cleanDish && cleanInput) {
      return cleanDish.includes(cleanInput) || cleanInput.includes(cleanDish);
    }
    return false;
  }

  // Handle order - create and ask for details
  static async handleOrder(phoneNumber, orderItems) {
    try {
      const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Clear any existing pending orders for this user
      await WhatsAppOrder.deleteMany({
        phoneNumber,
        status: { $in: ['pending_details', 'pending_payment'] }
      });

      // Create new WhatsApp order
      const whatsappOrder = new WhatsAppOrder({
        phoneNumber,
        items: orderItems,
        totalAmount,
        status: 'pending_details'
      });

      await whatsappOrder.save();

      // Send order confirmation
      let message = `🛒 *Your Order*\n\n`;
      orderItems.forEach(item => {
        message += `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}\n`;
      });
      message += `\n💰 *Total: ₹${totalAmount}*\n\n`;
      message += `📝 Please send your details:\n`;
      message += `Format: Name, Phone\n\n`;
      message += `Example: John Doe, 9876543210\n\n`;
      message += `Or reply *cancel* to cancel this order\n\n`;
      message += `💡 After order completion, type *quit* to start a new session`;

      await WhatsAppService.sendMessage(phoneNumber, message);

    } catch (error) {
      console.error('Error handling order:', error);
      await WhatsAppService.sendMessage(phoneNumber, '❌ Error processing order. Please try again.');
    }
  }

  // Send menu — split by category, max 4096 chars per message
  static async sendMenu(phoneNumber) {
    try {
      const dishes = await Dish.find({ available: true }).sort({ category: 1, name: 1 });

      if (dishes.length === 0) {
        return await WhatsAppService.sendMessage(phoneNumber, '❌ No dishes available right now.');
      }

      // Group by category
      const byCategory = {};
      dishes.forEach(dish => {
        const cat = dish.category || 'Other';
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(dish);
      });

      // Build messages, each ≤ 4000 chars (safe buffer below 4096)
      const MAX = 4000;
      const messages = [];
      let current = `🍽️ *Foodizzz Menu*\n\n`;

      for (const [category, items] of Object.entries(byCategory)) {
        let block = `*${category}*\n`;
        items.forEach((dish, i) => {
          block += `${i + 1}. ${dish.name} — ₹${dish.price}\n`;
        });
        block += '\n';

        // If adding this block would exceed limit, flush and start new message
        if (current.length + block.length > MAX) {
          messages.push(current.trim());
          current = block;
        } else {
          current += block;
        }
      }

      // Add ordering instructions to last chunk
      current += `📝 *How to order:*\n`;
      current += `• "2 butter chicken"\n`;
      current += `• "1 biryani"\n`;
      current += `• "paneer tikka"\n\n`;
      current += `Just tell me what you want! 😊`;

      messages.push(current.trim());

      // Send all chunks sequentially
      for (const msg of messages) {
        await WhatsAppService.sendMessage(phoneNumber, msg);
      }

    } catch (error) {
      console.error('Error sending menu:', error);
      await WhatsAppService.sendMessage(phoneNumber, '❌ Error loading menu. Please try again.');
    }
  }

  // Send welcome message
  static async sendWelcome(phoneNumber) {
    const message = `👋 *Welcome to OrderEase!*\n\n` +
      `🍽️ Type *menu* to see our dishes\n` +
      `📝 Just tell me what you want to order\n` +
      `🔍 Send Order ID to track your order\n\n` +
      `*Examples:*\n` +
      `• "2 pizza"\n` +
      `• "margherita pizza"\n` +
      `• "burger and coke"\n\n` +
      `What would you like today? 😊`;

    await WhatsAppService.sendMessage(phoneNumber, message);
  }

  // Send help message
  static async sendHelp(phoneNumber) {
    const message = `🤔 I didn't understand that.\n\n` +
      `*Try:*\n` +
      `• "menu" - See all dishes\n` +
      `• "2 pizza" - Order 2 pizzas\n` +
      `• "margherita" - Order margherita pizza\n` +
      `• "track 20241031-001" - Track order\n\n` +
      `What would you like to order? 😊`;

    await WhatsAppService.sendMessage(phoneNumber, message);
  }

  // Handle order tracking
  static async handleTracking(phoneNumber, message) {
    try {
      let orderId = null;

      // Extract order ID
      const orderIdMatch = message.match(/(\d{8}-\d{3})/);
      if (orderIdMatch) {
        orderId = orderIdMatch[1];
      } else {
        return await WhatsAppService.sendMessage(
          phoneNumber,
          '🔍 Please send your Order ID\n\nExample: 20241031-001'
        );
      }

      // Find order
      const order = await Order.findOne({ displayOrderId: orderId });
      if (!order) {
        return await WhatsAppService.sendMessage(
          phoneNumber,
          `❌ Order ${orderId} not found. Please check your Order ID.`
        );
      }

      // Send status
      const statusEmoji = {
        'queued': '⏳',
        'preparing': '👨‍🍳',
        'ready': '✅',
        'picked': '📦'
      };

      const statusText = {
        'queued': 'Order Received',
        'preparing': 'Being Prepared',
        'ready': 'Ready for Pickup',
        'picked': 'Completed'
      };

      let trackMessage = `${statusEmoji[order.status]} *${statusText[order.status]}*\n\n`;
      trackMessage += `📋 Order ID: ${order.displayOrderId}\n`;
      trackMessage += `👤 Customer: ${order.customer.name}\n\n`;
      
      trackMessage += `🍽️ *Items:*\n`;
      order.items.forEach(item => {
        trackMessage += `• ${item.name} × ${item.quantity}\n`;
      });

      const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      trackMessage += `\n💰 Total: ₹${totalAmount}`;

      await WhatsAppService.sendMessage(phoneNumber, trackMessage);

    } catch (error) {
      console.error('Error tracking order:', error);
      await WhatsAppService.sendMessage(phoneNumber, '❌ Error tracking order. Please try again.');
    }
  }

  // Handle customer details
  static async handleCustomerDetails(phoneNumber, message) {
    try {
      // Processing customer details
      
      // Find pending order waiting for details
      const whatsappOrder = await WhatsAppOrder.findOne({
        phoneNumber,
        status: 'pending_details'
      });

      // Checking for pending order

      if (!whatsappOrder) {
        // No pending order found
        return await WhatsAppService.sendMessage(phoneNumber, '❌ No pending order found. Please place a new order.');
      }

      if (message.toLowerCase().includes('cancel')) {
        await whatsappOrder.deleteOne();
        return await WhatsAppService.sendMessage(phoneNumber, '❌ Order cancelled. Type *menu* to start a new order.');
      }

      // Parse customer details - now only need name and phone
      const parts = message.split(',').map(part => part.trim());
      if (parts.length < 2) {
        return await WhatsAppService.sendMessage(
          phoneNumber,
          '❌ Please provide: Name, Phone\n\nExample: John Doe, 9876543210'
        );
      }

      const [name, phone] = parts;
      
      // Validate phone number (should be 10 digits)
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return await WhatsAppService.sendMessage(
          phoneNumber,
          '❌ Please provide a valid 10-digit phone number\n\nExample: Vaibhav, 9876543210'
        );
      }

      // Validate name (should not be empty and not be a number)
      if (!name || name.length < 2 || /^\d+$/.test(name)) {
        return await WhatsAppService.sendMessage(
          phoneNumber,
          '❌ Please provide a valid name\n\nExample: Vaibhav, 9876543210'
        );
      }

      // Update order with customer details (no address needed)
      whatsappOrder.customer = { name, phone, address: 'Not required' };
      whatsappOrder.status = 'pending_payment';
      await whatsappOrder.save();

      // Create Razorpay payment link
      try {
        const paymentLink = await SimpleOrderBot.createPaymentLink(
          whatsappOrder.totalAmount,
          whatsappOrder._id.toString()
        );

        const paymentMessage = `✅ *Details Confirmed!*\n\n` +
          `👤 ${name}\n` +
          `📞 ${phone}\n\n` +
          `💰 Total: ₹${whatsappOrder.totalAmount}\n\n` +
          `💳 *Complete Payment:*\n${paymentLink}\n\n` +
          `⚠️ Test mode - Use test card details\n\n` +
          `After payment, you'll get your Order ID! 🎉`;

        await WhatsAppService.sendMessage(phoneNumber, paymentMessage);

      } catch (error) {
        console.error('Error creating payment link:', error);
        
        // Fallback - create order without payment for now
        await WhatsAppService.sendMessage(
          phoneNumber,
          `✅ *Details Confirmed!*\n\n` +
          `👤 ${name}\n` +
          `📞 ${phone}\n\n` +
          `💰 Total: ₹${whatsappOrder.totalAmount}\n\n` +
          `⚠️ Payment system temporarily unavailable.\n` +
          `Your order is confirmed! 🎉`
        );

        // Create order anyway
        await SimpleOrderBot.createMainOrder(whatsappOrder);
      }

    } catch (error) {
      console.error('Error handling customer details:', error);
      await WhatsAppService.sendMessage(phoneNumber, '❌ Error processing details. Please try again.');
    }
  }

  // Create Razorpay payment link
  static async createPaymentLink(amount, orderId) {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const paymentLink = await razorpay.paymentLink.create({
        amount: amount * 100, // amount in paise
        currency: 'INR',
        accept_partial: false,
        description: `OrderEase - Order Payment`,
        customer: {
          name: 'OrderEase Customer',
        },
        notify: {
          sms: false,
          email: false,
          whatsapp: false
        },
        reminder_enable: false,
        notes: {
          whatsapp_order_id: orderId,
          source: 'whatsapp'
        },
        callback_url: `${process.env.BACKEND_URL}/api/whatsapp/payment-success`,
        callback_method: 'get'
      });

      // Payment link created successfully
      return paymentLink.short_url;

    } catch (error) {
      console.error('❌ Error creating payment link:', error);
      throw error;
    }
  }

  // Create main order
  static async createMainOrder(whatsappOrder) {
    try {
      // Generate order ID
      const nowIST = moment().tz('Asia/Kolkata');
      const datePrefix = nowIST.format('YYYYMMDD');
      
      const todayStart = nowIST.clone().startOf('day');
      const todayEnd = nowIST.clone().endOf('day');
      const latestOrder = await Order.findOne({
        createdAt: { $gte: todayStart.toDate(), $lte: todayEnd.toDate() },
        displayOrderId: { $regex: `^${datePrefix}-` }
      }).sort({ displayOrderId: -1 });

      let nextNumber = 1;
      if (latestOrder && latestOrder.displayOrderId) {
        const match = latestOrder.displayOrderId.match(/-(\d{3})$/);
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }
      const displayOrderId = `${datePrefix}-${String(nextNumber).padStart(3, '0')}`;

      // Create main order
      const order = new Order({
        items: whatsappOrder.items,
        customer: whatsappOrder.customer,
        status: 'queued',
        displayOrderId: displayOrderId,
        source: 'whatsapp'
      });

      await order.save();

      // Update WhatsApp order
      whatsappOrder.mainOrderId = order._id;
      whatsappOrder.status = 'completed';
      await whatsappOrder.save();

      // Send confirmation with order details
      const orderTime = moment().tz('Asia/Kolkata').format('hh:mm A');
      
      let confirmMessage = `🎉 *Payment Successful!*\n\n`;
      confirmMessage += `✅ Order placed at ${orderTime}\n`;
      confirmMessage += `📋 *Order ID:* ${displayOrderId}\n\n`;
      
      confirmMessage += `🍽️ *Your Order:*\n`;
      whatsappOrder.items.forEach(item => {
        confirmMessage += `• ${item.name} × ${item.quantity}\n`;
      });
      
      confirmMessage += `\n💰 Total: ₹${whatsappOrder.totalAmount}\n\n`;
      confirmMessage += `🔍 *Track anytime:* Send ${displayOrderId}\n\n`;
      confirmMessage += `Thank you for choosing OrderEase! 😊\n\n`;
      confirmMessage += `💡 Type *quit* to start a new order`;

      await WhatsAppService.sendMessage(whatsappOrder.phoneNumber, confirmMessage);

    } catch (error) {
      console.error('Error creating main order:', error);
    }
  }
}

module.exports = SimpleOrderBot;