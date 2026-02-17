const mongoose = require('mongoose');
const Dish = require('./models/Dish');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orderease', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample dishes with diverse menu items
const dishes = [
  // Indian Dishes
  {
    name: "Paneer Butter Masala",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    available: true,
    description: "Creamy tomato-based North Indian curry with soft paneer cubes",
    preparationTime: 15
  },
  {
    name: "Chicken Biryani",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop",
    available: true,
    description: "Aromatic basmati rice layered with spiced chicken and herbs",
    preparationTime: 25
  },
  {
    name: "Butter Chicken",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Tender chicken in rich, creamy tomato gravy with butter",
    preparationTime: 20
  },
  {
    name: "Masala Dosa",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy rice crepe filled with spiced potato masala",
    preparationTime: 15
  },
  {
    name: "Chole Bhature",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&h=500&fit=crop",
    available: true,
    description: "Spicy chickpea curry served with fluffy fried bread",
    preparationTime: 18
  },
  
  // Pizza & Italian
  {
    name: "Margherita Pizza",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
    available: true,
    description: "Classic cheese pizza with fresh basil and tomato sauce",
    preparationTime: 15
  },
  {
    name: "Pepperoni Pizza",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop",
    available: true,
    description: "Loaded with pepperoni slices and mozzarella cheese",
    preparationTime: 15
  },
  {
    name: "Pasta Alfredo",
    price: 219,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop",
    available: true,
    description: "Creamy fettuccine pasta with parmesan and garlic",
    preparationTime: 12
  },
  
  // Burgers & Fast Food
  {
    name: "Classic Beef Burger",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    available: true,
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    preparationTime: 10
  },
  {
    name: "Chicken Burger",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy fried chicken with mayo and fresh vegetables",
    preparationTime: 10
  },
  {
    name: "Veggie Burger",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=500&fit=crop",
    available: true,
    description: "Plant-based patty with avocado and fresh greens",
    preparationTime: 10
  },
  {
    name: "French Fries",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy golden fries with seasoning",
    preparationTime: 8
  },
  
  // Chinese
  {
    name: "Hakka Noodles",
    price: 169,
    imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop",
    available: true,
    description: "Stir-fried noodles with vegetables and soy sauce",
    preparationTime: 12
  },
  {
    name: "Fried Rice",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop",
    available: true,
    description: "Wok-tossed rice with vegetables and egg",
    preparationTime: 12
  },
  {
    name: "Manchurian",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop",
    available: true,
    description: "Deep-fried vegetable balls in spicy sauce",
    preparationTime: 15
  },
  
  // Desserts
  {
    name: "Chocolate Brownie",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500&h=500&fit=crop",
    available: true,
    description: "Gooey chocolate dessert topped with fudge sauce",
    preparationTime: 5
  },
  {
    name: "Ice Cream Sundae",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    available: true,
    description: "Vanilla ice cream with chocolate sauce and nuts",
    preparationTime: 5
  },
  {
    name: "Gulab Jamun",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1589119908995-c6c8f5b8b6c7?w=500&h=500&fit=crop",
    available: true,
    description: "Sweet milk dumplings soaked in sugar syrup",
    preparationTime: 5
  },
  
  // Beverages
  {
    name: "Fresh Lime Soda",
    price: 59,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop",
    available: true,
    description: "Refreshing lime juice with soda and mint",
    preparationTime: 3
  },
  {
    name: "Mango Lassi",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&h=500&fit=crop",
    available: true,
    description: "Creamy yogurt drink blended with sweet mango",
    preparationTime: 3
  },
  {
    name: "Cold Coffee",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop",
    available: true,
    description: "Chilled coffee with milk and ice cream",
    preparationTime: 5
  },
  
  // Healthy Options
  {
    name: "Caesar Salad",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop",
    available: true,
    description: "Fresh romaine lettuce with parmesan and croutons",
    preparationTime: 8
  },
  {
    name: "Grilled Chicken Salad",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500&h=500&fit=crop",
    available: true,
    description: "Healthy salad with grilled chicken and vegetables",
    preparationTime: 10
  },
  {
    name: "Fruit Bowl",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=500&h=500&fit=crop",
    available: true,
    description: "Fresh seasonal fruits with honey drizzle",
    preparationTime: 5
  },
  
  // Sandwiches & Wraps
  {
    name: "Club Sandwich",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=500&fit=crop",
    available: true,
    description: "Triple-decker sandwich with chicken, bacon, and veggies",
    preparationTime: 10
  },
  {
    name: "Paneer Wrap",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=500&fit=crop",
    available: true,
    description: "Grilled paneer wrapped with fresh vegetables",
    preparationTime: 8
  }
];

// Seed function
async function seedDishes() {
  try {
    // Clear existing dishes
    await Dish.deleteMany({});
    console.log('Cleared existing dishes');

    // Insert new dishes
    const result = await Dish.insertMany(dishes);
    console.log(`Successfully added ${result.length} dishes to the database`);
    
    // Display added dishes
    result.forEach((dish, index) => {
      console.log(`${index + 1}. ${dish.name} - ₹${dish.price}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding dishes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDishes();
