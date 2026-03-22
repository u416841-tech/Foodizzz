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
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Creamy tomato-based North Indian curry with soft paneer cubes",
    preparationTime: 15,
    category: "Indian"
  },
  {
    name: "Chicken Biryani",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Aromatic basmati rice layered with spiced chicken and herbs",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Butter Chicken",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Tender chicken in rich, creamy tomato gravy with butter",
    preparationTime: 20,
    category: "Indian"
  },
  {
    name: "Masala Dosa",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Crispy rice crepe filled with spiced potato masala",
    preparationTime: 15,
    category: "South Indian"
  },
  {
    name: "Chole Bhature",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Spicy chickpea curry served with fluffy fried bread",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Veg Thali",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Assorted vegetarian curries, rice, roti, salad and dessert",
    preparationTime: 20,
    category: "Indian"
  },
  {
    name: "Rajma Chawal",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Slow-cooked kidney beans curry served with steamed rice",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Pav Bhaji",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Spicy mashed vegetable curry served with buttered pav",
    preparationTime: 15,
    category: "Indian Street Food"
  },
  {
    name: "Vada Pav",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1668236543090-2a0b3a7c33d4?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Mumbai style spicy potato fritter burger with chutneys",
    preparationTime: 10,
    category: "Indian Street Food"
  },
  {
    name: "Idli Sambar",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1626082923331-ec7474c7da8e?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Soft steamed idlis served with sambar and chutneys",
    preparationTime: 12,
    category: "South Indian"
  },
  {
    name: "Dal Tadka with Jeera Rice",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Yellow lentils tempered with ghee and spices, served with cumin rice",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Palak Paneer",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Cottage cheese cubes in creamy spinach gravy with aromatic spices",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Kadai Paneer",
    price: 209,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Paneer cooked with bell peppers, onions and tomatoes in kadai masala",
    preparationTime: 20,
    category: "Indian"
  },
  {
    name: "Aloo Gobi",
    price: 169,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Potato and cauliflower curry with turmeric and Indian spices",
    preparationTime: 15,
    category: "Indian"
  },
  {
    name: "Mutton Rogan Josh",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Kashmiri style tender mutton curry with aromatic spices",
    preparationTime: 30,
    category: "Indian"
  },
  {
    name: "Fish Curry",
    price: 269,
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Fresh fish cooked in tangy coconut-based curry",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Tandoori Chicken",
    price: 279,
    imageUrl: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Marinated chicken grilled in tandoor with yogurt and spices",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Chicken Tikka Masala",
    price: 239,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Grilled chicken tikka in creamy tomato-based gravy",
    preparationTime: 22,
    category: "Indian"
  },
  {
    name: "Hyderabadi Dum Biryani",
    price: 259,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Slow-cooked aromatic rice with marinated meat and saffron",
    preparationTime: 30,
    category: "Indian"
  },
  {
    name: "Veg Biryani",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Fragrant basmati rice layered with mixed vegetables and spices",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Samosa (2 pcs)",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Crispy fried pastry filled with spiced potatoes and peas",
    preparationTime: 8,
    category: "Indian Street Food"
  },
  {
    name: "Paneer Tikka",
    price: 219,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Marinated paneer cubes grilled with bell peppers and onions",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Aloo Paratha with Curd",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Stuffed potato flatbread served with yogurt and pickle",
    preparationTime: 12,
    category: "Indian"
  },
  {
    name: "Naan Basket (3 pcs)",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Assorted naans - butter, garlic, and plain",
    preparationTime: 10,
    category: "Indian"
  },
  {
    name: "Garlic Naan",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Soft leavened bread topped with garlic and butter",
    preparationTime: 8,
    category: "Indian"
  },
  {
    name: "Butter Naan",
    price: 39,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Classic soft naan brushed with melted butter",
    preparationTime: 8,
    category: "Indian"
  },
  {
    name: "Roti (2 pcs)",
    price: 29,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Whole wheat flatbread cooked on tawa",
    preparationTime: 8,
    category: "Indian"
  },
  {
    name: "Uttapam",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Thick rice pancake topped with onions, tomatoes and chilies",
    preparationTime: 15,
    category: "South Indian"
  },
  {
    name: "Medu Vada (3 pcs)",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1626082923331-ec7474c7da8e?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Crispy lentil donuts served with sambar and chutney",
    preparationTime: 12,
    category: "South Indian"
  },
  {
    name: "Rava Dosa",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Crispy semolina crepe with onions and spices",
    preparationTime: 12,
    category: "South Indian"
  },
  {
    name: "Mysore Masala Dosa",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Spicy red chutney dosa filled with potato masala",
    preparationTime: 15,
    category: "South Indian"
  },
  {
    name: "Paneer Dosa",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=600&fit=crop&q=80",
    available: true,
    description: "Crispy dosa filled with spiced paneer mixture",
    preparationTime: 15,
    category: "South Indian"
  },
  {
    name: "Misal Pav",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Spicy sprouts curry topped with farsan, served with pav",
    preparationTime: 15,
    category: "Indian Street Food"
  },
  {
    name: "Dabeli",
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1668236543090-2a0b3a7c33d4?w=500&h=500&fit=crop",
    available: true,
    description: "Gujarati sweet and spicy potato burger with peanuts",
    preparationTime: 10,
    category: "Indian Street Food"
  },
  {
    name: "Pani Puri (6 pcs)",
    price: 59,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy puris filled with spicy tangy water and potatoes",
    preparationTime: 8,
    category: "Indian Street Food"
  },
  {
    name: "Bhel Puri",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Puffed rice mixed with vegetables, chutneys and sev",
    preparationTime: 8,
    category: "Indian Street Food"
  },
  {
    name: "Dahi Puri (6 pcs)",
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy puris filled with potatoes, yogurt and sweet chutney",
    preparationTime: 8,
    category: "Indian Street Food"
  },
  {
    name: "Sev Puri (6 pcs)",
    price: 69,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Flat puris topped with potatoes, chutneys and crispy sev",
    preparationTime: 8,
    category: "Indian Street Food"
  },
  {
    name: "Kachori (2 pcs)",
    price: 59,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Spicy lentil-filled fried pastry served with chutney",
    preparationTime: 10,
    category: "Indian Street Food"
  },
  {
    name: "Aloo Tikki Chaat",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy potato patties topped with yogurt, chutneys and sev",
    preparationTime: 12,
    category: "Indian Street Food"
  },
  {
    name: "Raj Kachori",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
    available: true,
    description: "Large crispy kachori filled with yogurt, chutneys and toppings",
    preparationTime: 10,
    category: "Indian Street Food"
  },
  {
    name: "Malai Kofta",
    price: 219,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    available: true,
    description: "Fried paneer and potato dumplings in creamy gravy",
    preparationTime: 22,
    category: "Indian"
  },
  {
    name: "Shahi Paneer",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    available: true,
    description: "Royal paneer curry in rich cashew and cream gravy",
    preparationTime: 20,
    category: "Indian"
  },
  {
    name: "Matar Paneer",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    available: true,
    description: "Paneer and green peas in tomato-onion gravy",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Baingan Bharta",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=500&fit=crop",
    available: true,
    description: "Smoky roasted eggplant mash cooked with spices",
    preparationTime: 20,
    category: "Indian"
  },
  {
    name: "Bhindi Masala",
    price: 169,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=500&fit=crop",
    available: true,
    description: "Okra stir-fried with onions, tomatoes and spices",
    preparationTime: 15,
    category: "Indian"
  },
  {
    name: "Mix Veg Curry",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=500&fit=crop",
    available: true,
    description: "Assorted vegetables in flavorful curry sauce",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Chicken Korma",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Mild chicken curry in creamy yogurt and nut gravy",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Chicken Curry",
    price: 229,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Traditional home-style chicken curry with aromatic spices",
    preparationTime: 25,
    category: "Indian"
  },
  {
    name: "Egg Curry",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Boiled eggs in spicy onion-tomato gravy",
    preparationTime: 18,
    category: "Indian"
  },
  {
    name: "Khichdi with Kadhi",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop",
    available: true,
    description: "Comfort food - rice and lentils with yogurt curry",
    preparationTime: 20,
    category: "Indian"
  },
  
  // Pizza & Italian
  {
    name: "Margherita Pizza",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
    available: true,
    description: "Classic cheese pizza with fresh basil and tomato sauce",
    preparationTime: 15,
    category: "Pizza"
  },
  {
    name: "Pepperoni Pizza",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop",
    available: true,
    description: "Loaded with pepperoni slices and mozzarella cheese",
    preparationTime: 15,
    category: "Pizza"
  },
  {
    name: "Pasta Alfredo",
    price: 219,
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop",
    available: true,
    description: "Creamy fettuccine pasta with parmesan and garlic",
    preparationTime: 12,
    category: "Pasta"
  },
  
  // Burgers & Fast Food
  {
    name: "Classic Beef Burger",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
    available: true,
    description: "Juicy beef patty with lettuce, tomato, and special sauce",
    preparationTime: 10,
    category: "Burgers"
  },
  {
    name: "Chicken Burger",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy fried chicken with mayo and fresh vegetables",
    preparationTime: 10,
    category: "Burgers"
  },
  {
    name: "Veggie Burger",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=500&fit=crop",
    available: true,
    description: "Plant-based patty with avocado and fresh greens",
    preparationTime: 10,
    category: "Burgers"
  },
  {
    name: "French Fries",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy golden fries with seasoning",
    preparationTime: 8,
    category: "Sides"
  },
  
  // Chinese
  {
    name: "Hakka Noodles",
    price: 169,
    imageUrl: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop",
    available: true,
    description: "Stir-fried noodles with vegetables and soy sauce",
    preparationTime: 12,
    category: "Chinese"
  },
  {
    name: "Fried Rice",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=500&fit=crop",
    available: true,
    description: "Wok-tossed rice with vegetables and egg",
    preparationTime: 12,
    category: "Chinese"
  },
  {
    name: "Manchurian",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&h=500&fit=crop",
    available: true,
    description: "Deep-fried vegetable balls in spicy sauce",
    preparationTime: 15,
    category: "Chinese"
  },
  
  // Desserts
  {
    name: "Chocolate Brownie",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500&h=500&fit=crop",
    available: true,
    description: "Gooey chocolate dessert topped with fudge sauce",
    preparationTime: 5,
    category: "Dessert"
  },
  {
    name: "Ice Cream Sundae",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=500&fit=crop",
    available: true,
    description: "Vanilla ice cream with chocolate sauce and nuts",
    preparationTime: 5,
    category: "Dessert"
  },
  {
    name: "Gulab Jamun",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1589119908995-c6c8f5b8b6c7?w=500&h=500&fit=crop",
    available: true,
    description: "Sweet milk dumplings soaked in sugar syrup",
    preparationTime: 5,
    category: "Indian Desserts"
  },
  {
    name: "Jalebi",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1630382848135-425a9620debd?w=500&h=500&fit=crop",
    available: true,
    description: "Crispy deep-fried spirals soaked in saffron sugar syrup",
    preparationTime: 7,
    category: "Indian Desserts"
  },
  {
    name: "Rasgulla",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1631292686325-9eede10c90f7?w=500&h=500&fit=crop",
    available: true,
    description: "Soft cottage cheese balls in light sugar syrup",
    preparationTime: 5,
    category: "Indian Desserts"
  },
  
  // Beverages
  {
    name: "Fresh Lime Soda",
    price: 59,
    imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop",
    available: true,
    description: "Refreshing lime juice with soda and mint",
    preparationTime: 3,
    category: "Beverages"
  },
  {
    name: "Mango Lassi",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&h=500&fit=crop",
    available: true,
    description: "Creamy yogurt drink blended with sweet mango",
    preparationTime: 3,
    category: "Beverages"
  },
  {
    name: "Cold Coffee",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=500&h=500&fit=crop",
    available: true,
    description: "Chilled coffee with milk and ice cream",
    preparationTime: 5,
    category: "Beverages"
  },
  {
    name: "Masala Chai",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=500&fit=crop",
    available: true,
    description: "Indian spiced tea brewed with milk and aromatic spices",
    preparationTime: 5,
    category: "Beverages"
  },
  
  // Healthy Options
  {
    name: "Caesar Salad",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop",
    available: true,
    description: "Fresh romaine lettuce with parmesan and croutons",
    preparationTime: 8,
    category: "Salads"
  },
  {
    name: "Grilled Chicken Salad",
    price: 189,
    imageUrl: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=500&h=500&fit=crop",
    available: true,
    description: "Healthy salad with grilled chicken and vegetables",
    preparationTime: 10,
    category: "Salads"
  },
  {
    name: "Fruit Bowl",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=500&h=500&fit=crop",
    available: true,
    description: "Fresh seasonal fruits with honey drizzle",
    preparationTime: 5,
    category: "Healthy"
  },
  
  // Sandwiches & Wraps
  {
    name: "Club Sandwich",
    price: 159,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=500&fit=crop",
    available: true,
    description: "Triple-decker sandwich with chicken, bacon, and veggies",
    preparationTime: 10,
    category: "Sandwiches & Wraps"
  },
  {
    name: "Paneer Wrap",
    price: 139,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=500&fit=crop",
    available: true,
    description: "Grilled paneer wrapped with fresh vegetables",
    preparationTime: 8,
    category: "Sandwiches & Wraps"
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
