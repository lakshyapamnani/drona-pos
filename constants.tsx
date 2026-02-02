
import { Category, MenuItem } from './types';

export const COLORS = {
  primary: '#F57C00', // Orange
  secondary: '#262626', // Dark Grey
  success: '#22c55e', // Green
  danger: '#ef4444', // Red
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: '10', name: 'Power Up W Greens' },
  { id: '11', name: 'Eggilicious' },
  { id: '12', name: 'Pasta' },
  { id: '13', name: 'Sandwiches' },
  { id: '14', name: 'Smokin Grill' },
  { id: '15', name: 'House of Keema' },
  { id: '16', name: 'Wraps Rolls Quesadilla' },
  { id: '17', name: 'Meals & More' },
  { id: '18', name: 'Beverages' },
  { id: '19', name: 'Smoothies & Bowls' },
  { id: '20', name: 'Dessert' },
  { id: '21', name: 'Add-ons' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Power Up W Greens Category (ID: 10)
  { id: 'g1', name: 'Sprouts Salad', price: 89, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g2', name: 'Soya Chunks', price: 89, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g3', name: 'Broccoli Corn Salad', price: 149, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g4', name: 'Wild Mushrooms', price: 129, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g5', name: 'High Protein Salad', price: 149, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g6', name: 'Caesar Salad', price: 149, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g7', name: 'American Salad', price: 169, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g8', name: 'Garden Chickpea Salad', price: 199, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g9', name: 'Greens N More', price: 179, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g10', name: 'Egg Salad', price: 189, categoryId: '10', isVeg: false, vegType: 'NON_VEG' },
  { id: 'g11', name: 'Lime Chicken Salad', price: 189, categoryId: '10', isVeg: false, vegType: 'NON_VEG' },
  { id: 'g12', name: 'Stir Fried Salad', price: 189, categoryId: '10', isVeg: false, vegType: 'NON_VEG' },
  { id: 'g13', name: 'Hummus Salad', price: 199, categoryId: '10', isVeg: true, vegType: 'VEG' },
  { id: 'g14', name: 'Chicken Curry Salad', price: 199, categoryId: '10', isVeg: false, vegType: 'NON_VEG' },

  // Eggilicious Category (ID: 11)
  { id: 'e1', name: 'Boil Eggs (Pack of 5)', price: 49, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e2', name: 'Sunny Side Up', price: 79, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e3', name: 'Scrambled Eggs (3 eggs)', price: 89, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e4', name: 'Mushroom Scrambled Eggs', price: 119, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e5', name: 'Chicken Scrambled Eggs', price: 129, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e6', name: 'Omelet', price: 79, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },
  { id: 'e7', name: 'Chicken Omelet', price: 129, categoryId: '11', isVeg: false, vegType: 'NON_VEG' },

  // Pasta Category (ID: 12)
  { id: 'p1', name: 'Burnt Garlic Pasta', price: 179, categoryId: '12', isVeg: true, vegType: 'VEG' },
  { id: 'p2', name: 'White Sauce Pasta', price: 229, categoryId: '12', isVeg: true, vegType: 'VEG' },
  { id: 'p3', name: 'Peri Peri Pasta', price: 229, categoryId: '12', isVeg: true, vegType: 'VEG' },
  { id: 'p4', name: 'Pesto Pasta', price: 289, categoryId: '12', isVeg: true, vegType: 'VEG' },
  { id: 'p5', name: 'Mexico Pasta', price: 289, categoryId: '12', isVeg: true, vegType: 'VEG' },

  // Sandwiches Category (ID: 13)
  { id: 's1', name: 'Russian Sandwich', price: 59, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's2', name: 'Peanut Butter Sandwich', price: 69, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's3', name: 'Chicken Russian Sandwich', price: 89, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's4', name: 'Egg Russian Sandwich', price: 79, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's5', name: 'Eggwich', price: 69, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's6', name: 'Veg Protein Sandwich (Soya)', price: 69, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's7', name: 'Paneer Sandwich', price: 79, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's8', name: 'Mushroom Sandwich', price: 79, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's9', name: 'Chicken Sandwich', price: 79, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's10', name: 'Hummus Sandwich', price: 139, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's11', name: 'Veg Keema Sandwich', price: 139, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's12', name: 'Chicken Keema Sandwich', price: 149, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's13', name: 'Egg Keema Sandwich', price: 129, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's14', name: 'Chicken Salami Sandwich', price: 149, categoryId: '13', isVeg: false, vegType: 'NON_VEG' },
  { id: 's15', name: 'Open Pesto Toast', price: 169, categoryId: '13', isVeg: true, vegType: 'VEG' },
  { id: 's16', name: 'Avocado Open Toast', price: 199, categoryId: '13', isVeg: true, vegType: 'VEG' },

  // Smokin Grill Category (ID: 14)
  { id: 'sg1', name: 'Egg Grilled', price: 119, categoryId: '14', isVeg: false, vegType: 'NON_VEG' },
  { id: 'sg2', name: 'Soya Grilled', price: 119, categoryId: '14', isVeg: true, vegType: 'VEG' },
  { id: 'sg3', name: 'Paneer Grilled', price: 159, categoryId: '14', isVeg: true, vegType: 'VEG' },
  { id: 'sg4', name: 'Chicken Grilled', price: 179, categoryId: '14', isVeg: false, vegType: 'NON_VEG' },
  { id: 'sg5', name: 'Fish Grilled', price: 249, categoryId: '14', isVeg: false, vegType: 'NON_VEG' },

  // House of Keema Category (ID: 15)
  { id: 'hk1', name: 'Egg Keema', price: 179, categoryId: '15', isVeg: false, vegType: 'NON_VEG' },
  { id: 'hk2', name: 'Soya Mushroom Keema', price: 199, categoryId: '15', isVeg: true, vegType: 'VEG' },
  { id: 'hk3', name: 'Paneer Keema', price: 249, categoryId: '15', isVeg: true, vegType: 'VEG' },
  { id: 'hk4', name: 'Chicken Keema', price: 249, categoryId: '15', isVeg: false, vegType: 'NON_VEG' },

  // Wraps Rolls Quesadilla Category (ID: 16)
  { id: 'wr1', name: 'Fiery Grilled Paneer Wrap', price: 199, categoryId: '16', isVeg: true, vegType: 'VEG' },
  { id: 'wr2', name: 'Fiery Grilled Chicken Wrap', price: 199, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr3', name: 'Fiery Grilled Fish Wrap', price: 299, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr4', name: 'Egg Roll', price: 199, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr5', name: 'Chicken Salami Roll', price: 249, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr6', name: 'Falafel Hummus Roll', price: 249, categoryId: '16', isVeg: true, vegType: 'VEG' },
  { id: 'wr7', name: 'Mexican Paneer Roll', price: 269, categoryId: '16', isVeg: true, vegType: 'VEG' },
  { id: 'wr8', name: 'Mexican Chicken Roll', price: 269, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr9', name: 'Mexican Fish Roll', price: 349, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },
  { id: 'wr10', name: 'Paneer Quesadilla', price: 279, categoryId: '16', isVeg: true, vegType: 'VEG' },
  { id: 'wr11', name: 'Chicken Quesadilla', price: 279, categoryId: '16', isVeg: false, vegType: 'NON_VEG' },

  // Meals & More Category (ID: 17)
  { id: 'm1', name: 'Egg Rice Bowl', price: 149, categoryId: '17', isVeg: false, vegType: 'NON_VEG' },
  { id: 'm2', name: 'Chicken Rice Bowl', price: 199, categoryId: '17', isVeg: false, vegType: 'NON_VEG' },
  { id: 'm3', name: 'Paneer Rice Bowl', price: 179, categoryId: '17', isVeg: true, vegType: 'VEG' },
  { id: 'm4', name: 'Veg Thali', price: 199, categoryId: '17', isVeg: true, vegType: 'VEG' },
  { id: 'm5', name: 'Non-Veg Thali', price: 249, categoryId: '17', isVeg: false, vegType: 'NON_VEG' },

  // Beverages Category (ID: 18)
  { id: 'b1', name: 'Fresh Lime Soda', price: 49, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b2', name: 'Cold Coffee', price: 79, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b3', name: 'Masala Chai', price: 29, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b4', name: 'Green Tea', price: 49, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b5', name: 'Black Coffee', price: 49, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b6', name: 'Cappuccino', price: 99, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b7', name: 'Latte', price: 99, categoryId: '18', isVeg: true, vegType: 'VEG' },
  { id: 'b8', name: 'Americano', price: 89, categoryId: '18', isVeg: true, vegType: 'VEG' },

  // Smoothies & Bowls Category (ID: 19)
  { id: 'sb1', name: 'Mango Smoothie', price: 129, categoryId: '19', isVeg: true, vegType: 'VEG' },
  { id: 'sb2', name: 'Berry Blast Smoothie', price: 149, categoryId: '19', isVeg: true, vegType: 'VEG' },
  { id: 'sb3', name: 'Protein Smoothie', price: 179, categoryId: '19', isVeg: true, vegType: 'VEG' },
  { id: 'sb4', name: 'Acai Bowl', price: 249, categoryId: '19', isVeg: true, vegType: 'VEG' },
  { id: 'sb5', name: 'Granola Bowl', price: 199, categoryId: '19', isVeg: true, vegType: 'VEG' },

  // Dessert Category (ID: 20)
  { id: 'd1', name: 'Chocolate Brownie', price: 99, categoryId: '20', isVeg: true, vegType: 'VEG' },
  { id: 'd2', name: 'Brownie with Ice Cream', price: 149, categoryId: '20', isVeg: true, vegType: 'VEG' },
  { id: 'd3', name: 'Cheesecake', price: 179, categoryId: '20', isVeg: true, vegType: 'VEG' },
  { id: 'd4', name: 'Tiramisu', price: 199, categoryId: '20', isVeg: true, vegType: 'VEG' },

  // Add-ons Category (ID: 21)
  { id: 'a1', name: 'Extra Cheese', price: 30, categoryId: '21', isVeg: true, vegType: 'VEG' },
  { id: 'a2', name: 'Extra Chicken (100g)', price: 80, categoryId: '21', isVeg: false, vegType: 'NON_VEG' },
  { id: 'a3', name: 'Extra Paneer (100g)', price: 60, categoryId: '21', isVeg: true, vegType: 'VEG' },
  { id: 'a4', name: 'Extra Egg', price: 20, categoryId: '21', isVeg: false, vegType: 'NON_VEG' },
  { id: 'a5', name: 'Extra Sauce', price: 20, categoryId: '21', isVeg: true, vegType: 'VEG' },
  { id: 'a6', name: 'Bread Basket', price: 49, categoryId: '21', isVeg: true, vegType: 'VEG' },
];

// Export missing TAX_RATE constant used in App.tsx
export const TAX_RATE = 0.05;
