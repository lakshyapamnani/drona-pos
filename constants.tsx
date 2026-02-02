
import { Category, MenuItem } from './types';

export const COLORS = {
  primary: '#F57C00', // Orange
  secondary: '#262626', // Dark Grey
  success: '#22c55e', // Green
  danger: '#ef4444', // Red
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Power Up W Greens' },
  { id: 'cat2', name: 'Eggilicious' },
  { id: 'cat3', name: 'Humming Hummus' },
  { id: 'cat4', name: 'Pasta' },
  { id: 'cat5', name: 'Sandwiches' },
  { id: 'cat6', name: 'Smokin Grill' },
  { id: 'cat7', name: 'House of Keema' },
  { id: 'cat8', name: 'Wraps Rolls & Quesadilla' },
  { id: 'cat9', name: 'Meals & More' },
  { id: 'cat10', name: 'Beverages' },
  { id: 'cat11', name: 'Smoothies & Bowls' },
  { id: 'cat12', name: 'Dessert' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Power Up W Greens (cat1)
  { id: 'item1', name: 'Sprouts Salad', price: 89, categoryId: 'cat1', isVeg: true, vegType: 'VEG' },
  { id: 'item2', name: 'Soya Chunks', price: 89, categoryId: 'cat1', isVeg: true, vegType: 'VEG' },
  { id: 'item3', name: 'Broccoli Corn Salad', price: 149, categoryId: 'cat1', isVeg: true, vegType: 'VEG' },
  { id: 'item4', name: 'Wild Mushrooms', price: 129, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 129, nonVegPrice: 159 },
  { id: 'item5', name: 'High Protein Salad', price: 149, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 149, nonVegPrice: 189 },
  { id: 'item6', name: 'Caesar Salad', price: 149, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 149, nonVegPrice: 179 },
  { id: 'item7', name: 'American Salad', price: 169, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 169, nonVegPrice: 189 },
  { id: 'item8', name: 'Garden Chickpea Salad', price: 199, categoryId: 'cat1', isVeg: true, vegType: 'VEG' },
  { id: 'item9', name: 'Greens N More', price: 179, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 179, nonVegPrice: 199 },
  { id: 'item10', name: 'Egg Salad', price: 189, categoryId: 'cat1', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item11', name: 'Lime Chicken Salad', price: 189, categoryId: 'cat1', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item12', name: 'Stir Fried Salad', price: 189, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 189, nonVegPrice: 209 },
  { id: 'item13', name: 'Hummus Salad', price: 199, categoryId: 'cat1', isVeg: true, vegType: 'BOTH', vegPrice: 199, nonVegPrice: 229 },
  { id: 'item14', name: 'Chicken Curry Salad', price: 199, categoryId: 'cat1', isVeg: false, vegType: 'NON_VEG' },

  // Eggilicious (cat2)
  { id: 'item15', name: 'Boil Eggs (Pack of 5)', price: 49, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item16', name: 'Sunny Side Up', price: 79, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item17', name: 'Scrambled Eggs (3 eggs)', price: 89, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item18', name: 'Mushroom Scrambled Eggs', price: 119, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item19', name: 'Chicken Scrambled Eggs', price: 129, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item20', name: 'Omelet', price: 79, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item21', name: 'Chicken Omelet', price: 129, categoryId: 'cat2', isVeg: false, vegType: 'NON_VEG' },

  // Humming Hummus (cat3)
  { id: 'item22', name: 'Classic Hummus', price: 199, categoryId: 'cat3', isVeg: true, vegType: 'VEG' },
  { id: 'item23', name: 'Peri Peri Hummus', price: 219, categoryId: 'cat3', isVeg: true, vegType: 'VEG' },
  { id: 'item24', name: 'Pesto Hummus', price: 219, categoryId: 'cat3', isVeg: true, vegType: 'VEG' },
  { id: 'item25', name: 'Hummus Platter', price: 349, categoryId: 'cat3', isVeg: true, vegType: 'VEG' },

  // Pasta (cat4)
  { id: 'item26', name: 'Burnt Garlic Pasta', price: 179, categoryId: 'cat4', isVeg: true, vegType: 'BOTH', vegPrice: 179, nonVegPrice: 199 },
  { id: 'item27', name: 'White Sauce Pasta', price: 229, categoryId: 'cat4', isVeg: true, vegType: 'BOTH', vegPrice: 229, nonVegPrice: 259 },
  { id: 'item28', name: 'Peri Peri Pasta', price: 229, categoryId: 'cat4', isVeg: true, vegType: 'BOTH', vegPrice: 229, nonVegPrice: 259 },
  { id: 'item29', name: 'Pesto Pasta', price: 289, categoryId: 'cat4', isVeg: true, vegType: 'BOTH', vegPrice: 289, nonVegPrice: 319 },
  { id: 'item30', name: 'Mexico Pasta', price: 289, categoryId: 'cat4', isVeg: true, vegType: 'BOTH', vegPrice: 289, nonVegPrice: 319 },

  // Sandwiches (cat5)
  { id: 'item31', name: 'Russian Sandwich', price: 59, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item32', name: 'Peanut Butter Sandwich', price: 69, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item33', name: 'Chicken Russian Sandwich', price: 89, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item34', name: 'Egg Russian Sandwich', price: 79, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item35', name: 'Eggwich', price: 69, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item36', name: 'Veg Protein Sandwich (Soya)', price: 69, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item37', name: 'Paneer Sandwich', price: 79, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item38', name: 'Mushroom Sandwich', price: 79, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item39', name: 'Chicken Sandwich', price: 79, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item40', name: 'Hummus Sandwich', price: 139, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item41', name: 'Veg Keema Sandwich', price: 139, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item42', name: 'Chicken Keema Sandwich', price: 149, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item43', name: 'Egg Keema Sandwich', price: 129, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item44', name: 'Chicken Salami Sandwich', price: 149, categoryId: 'cat5', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item45', name: 'Open Pesto Toast', price: 169, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },
  { id: 'item46', name: 'Avocado Open Toast', price: 199, categoryId: 'cat5', isVeg: true, vegType: 'VEG' },

  // Smokin Grill (cat6)
  { id: 'item47', name: 'Egg Grilled', price: 119, categoryId: 'cat6', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item48', name: 'Soya Grilled', price: 119, categoryId: 'cat6', isVeg: true, vegType: 'VEG' },
  { id: 'item49', name: 'Paneer Grilled', price: 159, categoryId: 'cat6', isVeg: true, vegType: 'VEG' },
  { id: 'item50', name: 'Chicken Grilled', price: 179, categoryId: 'cat6', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item51', name: 'Fish Grilled', price: 249, categoryId: 'cat6', isVeg: false, vegType: 'NON_VEG' },

  // House of Keema (cat7)
  { id: 'item52', name: 'Egg Keema', price: 179, categoryId: 'cat7', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item53', name: 'Soya Mushroom Keema', price: 199, categoryId: 'cat7', isVeg: true, vegType: 'VEG' },
  { id: 'item54', name: 'Paneer Keema', price: 249, categoryId: 'cat7', isVeg: true, vegType: 'VEG' },
  { id: 'item55', name: 'Chicken Keema', price: 249, categoryId: 'cat7', isVeg: false, vegType: 'NON_VEG' },

  // Wraps Rolls & Quesadilla (cat8)
  { id: 'item56', name: 'Fiery Grilled Paneer Wrap', price: 199, categoryId: 'cat8', isVeg: true, vegType: 'VEG' },
  { id: 'item57', name: 'Fiery Grilled Chicken Wrap', price: 199, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item58', name: 'Fiery Grilled Fish Wrap', price: 299, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item59', name: 'Egg Roll', price: 199, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item60', name: 'Chicken Salami Roll', price: 249, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item61', name: 'Falafel Hummus Roll', price: 249, categoryId: 'cat8', isVeg: true, vegType: 'VEG' },
  { id: 'item62', name: 'Mexican Paneer Roll', price: 269, categoryId: 'cat8', isVeg: true, vegType: 'VEG' },
  { id: 'item63', name: 'Mexican Chicken Roll', price: 269, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item64', name: 'Mexican Fish Roll', price: 349, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item65', name: 'Paneer Quesadilla', price: 279, categoryId: 'cat8', isVeg: true, vegType: 'VEG' },
  { id: 'item66', name: 'Chicken Quesadilla', price: 279, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item67', name: 'Falafel Quesadilla', price: 279, categoryId: 'cat8', isVeg: true, vegType: 'VEG' },
  { id: 'item68', name: 'Fish Quesadilla', price: 349, categoryId: 'cat8', isVeg: false, vegType: 'NON_VEG' },

  // Meals & More (cat9)
  { id: 'item69', name: 'Veg Grill Meal', price: 269, categoryId: 'cat9', isVeg: true, vegType: 'VEG' },
  { id: 'item70', name: 'Non Veg Grill Meal', price: 269, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item71', name: 'Fish Grill Meal', price: 349, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item72', name: 'Paneer Meal', price: 279, categoryId: 'cat9', isVeg: true, vegType: 'VEG' },
  { id: 'item73', name: 'Chicken Meal', price: 279, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item74', name: 'Fish Meal', price: 279, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item75', name: 'Mexican Paneer Meal', price: 279, categoryId: 'cat9', isVeg: true, vegType: 'VEG' },
  { id: 'item76', name: 'Mexican Chicken Meal', price: 279, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },
  { id: 'item77', name: 'Mexican Fish Meal', price: 279, categoryId: 'cat9', isVeg: false, vegType: 'NON_VEG' },

  // Beverages (cat10)
  { id: 'item78', name: 'Apple', price: 79, categoryId: 'cat10', isVeg: true, vegType: 'VEG' },
  { id: 'item79', name: 'Peach', price: 89, categoryId: 'cat10', isVeg: true, vegType: 'VEG' },
  { id: 'item80', name: 'Watermelon', price: 79, categoryId: 'cat10', isVeg: true, vegType: 'VEG' },
  { id: 'item81', name: 'Orange', price: 79, categoryId: 'cat10', isVeg: true, vegType: 'VEG' },
  { id: 'item82', name: 'Zero Coke', price: 69, categoryId: 'cat10', isVeg: true, vegType: 'VEG' },

  // Smoothies & Bowls (cat11)
  { id: 'item83', name: 'Banana', price: 99, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item84', name: 'Cocoa', price: 119, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item85', name: 'Poppin Peanut Butter', price: 129, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item86', name: 'Wake Me Up', price: 149, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item87', name: 'Hi Protein Smoothie', price: 179, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item88', name: 'Blueberry Blue Moon', price: 179, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item89', name: 'Berry Special Strawberry', price: 179, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item90', name: 'Mix Berries', price: 179, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },
  { id: 'item91', name: 'Avocado', price: 299, categoryId: 'cat11', isVeg: true, vegType: 'VEG' },

  // Dessert (cat12)
  { id: 'item92', name: 'Cheese Cake', price: 279, categoryId: 'cat12', isVeg: true, vegType: 'VEG' },
  { id: 'item93', name: 'Brownie', price: 179, categoryId: 'cat12', isVeg: true, vegType: 'VEG' },
];

// Export TAX_RATE constant used in App.tsx
export const TAX_RATE = 0.05;
