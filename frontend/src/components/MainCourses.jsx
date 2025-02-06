// src/pages/MainCourses.jsx
import MenuSection from '../components/MenuSection';
import { menuData } from '../App';

export default function MainCourses() {
  return (
    <MenuSection title="Main Courses" items={menuData[1].items} />
  );
}
