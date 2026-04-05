const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.baseURL = 'https://graph.facebook.com/v18.0';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  }

  // Send a text message to WhatsApp
  static async sendMessage(to, message) {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!phoneNumberId || !accessToken) {
        console.error('WhatsApp credentials not configured');
        return false;
      }

      // WhatsApp hard limit is 4096 chars — truncate with notice if exceeded
      const safeMessage = message.length > 4096
        ? message.substring(0, 4050) + '\n\n_...message truncated_'
        : message;

      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: safeMessage }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Message sent successfully
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      return false;
    }
  }

  // Send a template message (for structured messages)
  static async sendTemplateMessage(to, templateName, languageCode = 'en', components = []) {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!phoneNumberId || !accessToken) {
        console.error('WhatsApp credentials not configured');
        return false;
      }

      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: components
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Template message sent successfully
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp template message:', error.response?.data || error.message);
      return false;
    }
  }

  // Send an interactive message with buttons
  static async sendInteractiveMessage(to, bodyText, buttons) {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!phoneNumberId || !accessToken) {
        console.error('WhatsApp credentials not configured');
        return false;
      }

      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: bodyText
          },
          action: {
            buttons: buttons.map((button, index) => ({
              type: 'reply',
              reply: {
                id: `btn_${index}`,
                title: button
              }
            }))
          }
        }
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Interactive message sent successfully
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp interactive message:', error.response?.data || error.message);
      return false;
    }
  }

  // Mark message as read
  static async markAsRead(messageId) {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!phoneNumberId || !accessToken) {
        console.error('WhatsApp credentials not configured');
        return false;
      }

      const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      // Message marked as read successfully
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error.response?.data || error.message);
      return false;
    }
  }

  // Get media URL from media ID
  static async getMediaUrl(mediaId) {
    try {
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!accessToken) {
        console.error('WhatsApp access token not configured');
        return null;
      }

      const url = `https://graph.facebook.com/v18.0/${mediaId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Error getting media URL:', error.response?.data || error.message);
      return null;
    }
  }

  // Validate webhook signature (security feature)
  static validateWebhookSignature(payload, signature) {
    try {
      const crypto = require('crypto');
      const appSecret = process.env.WHATSAPP_APP_SECRET;

      if (!appSecret) {
        console.warn('WhatsApp app secret not configured - skipping signature validation');
        return true; // Allow in development
      }

      const expectedSignature = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');

      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      console.error('Error validating webhook signature:', error);
      return false;
    }
  }

  // Send order confirmation message
  static async sendOrderConfirmation(to, orderDetails) {
    try {
      let message = `✅ *Order Confirmed!*\n\n`;
      message += `📋 Order ID: ${orderDetails.displayOrderId}\n`;
      message += `👤 Customer: ${orderDetails.customer.name}\n`;
      message += `📞 Phone: ${orderDetails.customer.phone}\n\n`;
      
      message += `🍽️ *Items:*\n`;
      orderDetails.items.forEach(item => {
        message += `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}\n`;
      });

      const totalAmount = orderDetails.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      message += `\n💰 *Total: ₹${totalAmount}*\n\n`;
      
      message += `⏳ Status: Order Received\n`;
      message += `📅 Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;
      message += `🔍 Track your order anytime by sending: *${orderDetails.displayOrderId}*\n\n`;
      message += `💡 Type *quit* to start a new order`;

      return await WhatsAppService.sendMessage(to, message);
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  // Send payment success message
  static async sendPaymentSuccess(to, orderDetails) {
    try {
      const moment = require('moment-timezone');
      const orderTime = moment().tz('Asia/Kolkata').format('hh:mm A');
      
      let message = `🎉 *Payment Successful!*\n\n`;
      message += `✅ Order placed at ${orderTime}\n`;
      message += `📋 *Order ID:* ${orderDetails.displayOrderId}\n\n`;
      
      message += `🍽️ *Your Order:*\n`;
      orderDetails.items.forEach(item => {
        message += `• ${item.name} × ${item.quantity}\n`;
      });
      
      const totalAmount = orderDetails.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      message += `\n💰 Total: ₹${totalAmount}\n\n`;
      
      message += `🔍 *Track anytime:* Send ${orderDetails.displayOrderId}\n\n`;
      message += `Thank you for choosing OrderEase! 😊\n\n`;
      message += `💡 Type *quit* to start a new order`;

      return await WhatsAppService.sendMessage(to, message);
    } catch (error) {
      console.error('Error sending payment success message:', error);
      return false;
    }
  }

  // Send status update message
  static async sendStatusUpdate(to, orderDetails, newStatus) {
    try {
      const statusEmoji = {
        'queued': '⏳',
        'preparing': '👨‍🍳',
        'ready': '✅',
        'picked': '📦'
      };

      const statusText = {
        'queued': 'Order Received - In Queue',
        'preparing': 'Being Prepared',
        'ready': 'Ready for Pickup',
        'picked': 'Order Completed'
      };

      let message = `${statusEmoji[newStatus]} *Order Status Updated*\n\n`;
      message += `📋 Order ID: ${orderDetails.displayOrderId}\n`;
      message += `🔄 Status: ${statusText[newStatus]}\n\n`;

      if (newStatus === 'ready') {
        message += `🎉 Your order is ready for pickup!\n`;
        message += `📍 Please collect from the restaurant.\n\n`;
      } else if (newStatus === 'preparing') {
        message += `🔄 Your order is now being prepared.\n\n`;
      }

      message += `Thank you for your patience! 😊`;

      return await WhatsAppService.sendMessage(to, message);
    } catch (error) {
      console.error('Error sending status update:', error);
      return false;
    }
  }
}

module.exports = WhatsAppService;