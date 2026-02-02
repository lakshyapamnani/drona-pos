
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
  { id: 'g1', name: 'Sprouts Salad', price: 89, categoryId: '10', isVeg: true },
  { id: 'g2', name: 'Soya Chunks', price: 89, categoryId: '10', isVeg: true },
  { id: 'g3', name: 'Broccoli Corn Salad', price: 149, categoryId: '10', isVeg: true },
  { id: 'g4', name: 'Wild Mushrooms', price: 129, categoryId: '10', isVeg: true },
  { id: 'g5', name: 'High Protein Salad', price: 149, categoryId: '10', isVeg: true },
  { id: 'g6', name: 'Caesar Salad', price: 149, categoryId: '10', isVeg: true },
  { id: 'g7', name: 'American Salad', price: 169, categoryId: '10', isVeg: true },
  { id: 'g8', name: 'Garden Chickpea Salad', price: 199, categoryId: '10', isVeg: true },
  { id: 'g9', name: 'Greens N More', price: 179, categoryId: '10', isVeg: true },
  { id: 'g10', name: 'Egg Salad', price: 189, categoryId: '10', isVeg: false },
  { id: 'g11', name: 'Lime Chicken Salad', price: 189, categoryId: '10', isVeg: false },
  { id: 'g12', name: 'Stir Fried Salad', price: 189, categoryId: '10', isVeg: false },
  { id: 'g13', name: 'Hummus Salad', price: 199, categoryId: '10', isVeg: true },
  { id: 'g14', name: 'Chicken Curry Salad', price: 199, categoryId: '10', isVeg: false },

  // Eggilicious Category (ID: 11)
  { id: 'e1', name: 'Boil Eggs (Pack of 5)', price: 49, categoryId: '11', isVeg: false },
  { id: 'e2', name: 'Sunny Side Up', price: 79, categoryId: '11', isVeg: false },
  { id: 'e3', name: 'Scrambled Eggs (3 eggs)', price: 89, categoryId: '11', isVeg: false },
  { id: 'e4', name: 'Mushroom Scrambled Eggs', price: 119, categoryId: '11', isVeg: false },
  { id: 'e5', name: 'Chicken Scrambled Eggs', price: 129, categoryId: '11', isVeg: false },
  { id: 'e6', name: 'Omelet', price: 79, categoryId: '11', isVeg: false },
  { id: 'e7', name: 'Chicken Omelet', price: 129, categoryId: '11', isVeg: false },

  // Pasta Category (ID: 12)
  { id: 'p1', name: 'Burnt Garlic Pasta', price: 179, categoryId: '12', isVeg: true },
  { id: 'p2', name: 'White Sauce Pasta', price: 229, categoryId: '12', isVeg: true },
  { id: 'p3', name: 'Peri Peri Pasta', price: 229, categoryId: '12', isVeg: true },
  { id: 'p4', name: 'Pesto Pasta', price: 289, categoryId: '12', isVeg: true },
  { id: 'p5', name: 'Mexico Pasta', price: 289, categoryId: '12', isVeg: true },

  // Sandwiches Category (ID: 13)
  { id: 's1', name: 'Russian Sandwich', price: 59, categoryId: '13', isVeg: true },
  { id: 's2', name: 'Peanut Butter Sandwich', price: 69, categoryId: '13', isVeg: true },
  { id: 's3', name: 'Chicken Russian Sandwich', price: 89, categoryId: '13', isVeg: false },
  { id: 's4', name: 'Egg Russian Sandwich', price: 79, categoryId: '13', isVeg: false },
  { id: 's5', name: 'Eggwich', price: 69, categoryId: '13', isVeg: false },
  { id: 's6', name: 'Veg Protein Sandwich (Soya)', price: 69, categoryId: '13', isVeg: true },
  { id: 's7', name: 'Paneer Sandwich', price: 79, categoryId: '13', isVeg: true },
  { id: 's8', name: 'Mushroom Sandwich', price: 79, categoryId: '13', isVeg: true },
  { id: 's9', name: 'Chicken Sandwich', price: 79, categoryId: '13', isVeg: false },
  { id: 's10', name: 'Hummus Sandwich', price: 139, categoryId: '13', isVeg: true },
  { id: 's11', name: 'Veg Keema Sandwich', price: 139, categoryId: '13', isVeg: true },
  { id: 's12', name: 'Chicken Keema Sandwich', price: 149, categoryId: '13', isVeg: false },
  { id: 's13', name: 'Egg Keema Sandwich', price: 129, categoryId: '13', isVeg: false },
  { id: 's14', name: 'Chicken Salami Sandwich', price: 149, categoryId: '13', isVeg: false },
  { id: 's15', name: 'Open Pesto Toast', price: 169, categoryId: '13', isVeg: true },
  { id: 's16', name: 'Avocado Open Toast', price: 199, categoryId: '13', isVeg: true },

  // Smokin Grill Category (ID: 14)
  { id: 'sg1', name: 'Egg Grilled', price: 119, categoryId: '14', isVeg: false },
  { id: 'sg2', name: 'Soya Grilled', price: 119, categoryId: '14', isVeg: true },
  { id: 'sg3', name: 'Paneer Grilled', price: 159, categoryId: '14', isVeg: true },
  { id: 'sg4', name: 'Chicken Grilled', price: 179, categoryId: '14', isVeg: false },
  { id: 'sg5', name: 'Fish Grilled', price: 249, categoryId: '14', isVeg: false },

  // House of Keema Category (ID: 15)
  { id: 'hk1', name: 'Egg Keema', price: 179, categoryId: '15', isVeg: false },
  { id: 'hk2', name: 'Soya Mushroom Keema', price: 199, categoryId: '15', isVeg: true },
  { id: 'hk3', name: 'Paneer Keema', price: 249, categoryId: '15', isVeg: true },
  { id: 'hk4', name: 'Chicken Keema', price: 249, categoryId: '15', isVeg: false },

  // Wraps Rolls Quesadilla Category (ID: 16)
  { id: 'wr1', name: 'Fiery Grilled Paneer Wrap', price: 199, categoryId: '16', isVeg: true },
  { id: 'wr2', name: 'Fiery Grilled Chicken Wrap', price: 199, categoryId: '16', isVeg: false },
  { id: 'wr3', name: 'Fiery Grilled Fish Wrap', price: 299, categoryId: '16', isVeg: false },
  { id: 'wr4', name: 'Egg Roll', price: 199, categoryId: '16', isVeg: false },
  { id: 'wr5', name: 'Chicken Salami Roll', price: 249, categoryId: '16', isVeg: false },
  { id: 'wr6', name: 'Falafel Hummus Roll', price: 249, categoryId: '16', isVeg: true },
  { id: 'wr7', name: 'Mexican Paneer Roll', price: 269, categoryId: '16', isVeg: true },
  { id: 'wr8', name: 'Mexican Chicken Roll', price: 269, categoryId: '16', isVeg: false },
  { id: 'wr9', name: 'Mexican Fish Roll', price: 349, categoryId: '16', isVeg: false },
  // Fix truncated object and end array
  { id: 'wr10', name: 'Paneer Quesadilla', price: 279, categoryId: '16', isVeg: true },
];

// Export missing TAX_RATE constant used in App.tsx
export const TAX_RATE = 0.05;
