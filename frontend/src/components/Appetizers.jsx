// src/pages/Appetizers.jsx
import MenuSection from '../components/MenuSection';
import { menuData } from '../App'; // You can import the menu data from App.js

export default function Appetizers() {
  return (
    <MenuSection title="Appetizers" items={menuData[0].items} />
  );
}
