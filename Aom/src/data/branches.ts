import type { Branch, BranchId, Category } from "../types";

export const branches: Branch[] = [
  {
    id: "civil",
    nameTH: "วิศวกรรมโยธา",
    nameEN: "Civil Engineering",
    icon: "🏗️",
    color: "#F59E0B",
  },
  {
    id: "electrical",
    nameTH: "วิศวกรรมไฟฟ้า",
    nameEN: "Electrical Engineering",
    icon: "⚡",
    color: "#3B82F6",
  },
  {
    id: "mechanical",
    nameTH: "วิศวกรรมเครื่องกล",
    nameEN: "Mechanical Engineering",
    icon: "⚙️",
    color: "#8B5CF6",
  },
  {
    id: "industrial",
    nameTH: "วิศวกรรมอุตสาหการ",
    nameEN: "Industrial Engineering",
    icon: "🏭",
    color: "#EF4444",
  },
  {
    id: "chemical",
    nameTH: "วิศวกรรมเคมี",
    nameEN: "Chemical Engineering",
    icon: "🧪",
    color: "#10B981",
  },
  {
    id: "environmental",
    nameTH: "วิศวกรรมสิ่งแวดล้อม",
    nameEN: "Environmental Engineering",
    icon: "🌿",
    color: "#22C55E",
  },
];

const branchSpecificSubcategories: Record<
  BranchId,
  { id: string; nameTH: string; nameEN: string }[]
> = {
  civil: [
    {
      id: "structural",
      nameTH: "วิเคราะห์โครงสร้าง",
      nameEN: "Structural Analysis",
    },
    {
      id: "geotechnical",
      nameTH: "ปฐพีวิศวกรรม",
      nameEN: "Geotechnical Engineering",
    },
    { id: "fluid", nameTH: "กลศาสตร์ของไหล", nameEN: "Fluid Mechanics" },
    {
      id: "transportation",
      nameTH: "วิศวกรรมการขนส่ง",
      nameEN: "Transportation Engineering",
    },
    {
      id: "construction",
      nameTH: "การจัดการการก่อสร้าง",
      nameEN: "Construction Management",
    },
  ],
  electrical: [
    { id: "circuit", nameTH: "ทฤษฎีวงจรไฟฟ้า", nameEN: "Circuit Theory" },
    { id: "power", nameTH: "ระบบไฟฟ้ากำลัง", nameEN: "Power Systems" },
    { id: "control", nameTH: "ระบบควบคุม", nameEN: "Control Systems" },
    { id: "electronics", nameTH: "อิเล็กทรอนิกส์", nameEN: "Electronics" },
    {
      id: "safety",
      nameTH: "ความปลอดภัยทางไฟฟ้า",
      nameEN: "Electrical Safety",
    },
  ],
  mechanical: [
    { id: "thermo", nameTH: "อุณหพลศาสตร์", nameEN: "Thermodynamics" },
    { id: "fluid_mech", nameTH: "กลศาสตร์ของไหล", nameEN: "Fluid Mechanics" },
    {
      id: "machine_design",
      nameTH: "การออกแบบเครื่องจักร",
      nameEN: "Machine Design",
    },
    {
      id: "manufacturing",
      nameTH: "กระบวนการผลิต",
      nameEN: "Manufacturing Processes",
    },
    { id: "vibrations", nameTH: "การสั่นสะเทือน", nameEN: "Vibrations" },
  ],
  industrial: [
    {
      id: "operations",
      nameTH: "การวิจัยดำเนินงาน",
      nameEN: "Operations Research",
    },
    {
      id: "production",
      nameTH: "การวางแผนการผลิต",
      nameEN: "Production Planning",
    },
    { id: "quality", nameTH: "วิศวกรรมคุณภาพ", nameEN: "Quality Engineering" },
    { id: "ergonomics", nameTH: "การยศาสตร์", nameEN: "Ergonomics" },
    { id: "ie_tools", nameTH: "เครื่องมือ IE", nameEN: "IE Tools" },
  ],
  chemical: [
    {
      id: "reaction",
      nameTH: "วิศวกรรมปฏิกิริยาเคมี",
      nameEN: "Chemical Reaction Engineering",
    },
    {
      id: "transport",
      nameTH: "ปรากฏการณ์การถ่ายเท",
      nameEN: "Transport Phenomena",
    },
    {
      id: "chem_thermo",
      nameTH: "อุณหพลศาสตร์เคมี",
      nameEN: "Chemical Thermodynamics",
    },
    { id: "process", nameTH: "การออกแบบกระบวนการ", nameEN: "Process Design" },
  ],
  environmental: [
    { id: "water", nameTH: "การบำบัดน้ำ", nameEN: "Water Treatment" },
    { id: "air", nameTH: "มลพิษทางอากาศ", nameEN: "Air Pollution" },
    { id: "waste", nameTH: "การจัดการขยะ", nameEN: "Waste Management" },
    { id: "env_law", nameTH: "กฎหมายสิ่งแวดล้อม", nameEN: "Environmental Law" },
    { id: "eia", nameTH: "การประเมินผลกระทบสิ่งแวดล้อม", nameEN: "EIA" },
  ],
};

export const generalCategory: Category = {
  id: "general",
  nameTH: "หมวดวิชาพื้นฐานวิศวกรรมทั่วไป",
  nameEN: "General Engineering Fundamentals",
  subcategories: [
    {
      id: "ethics",
      nameTH: "จริยธรรมวิชาชีพและกฎหมาย",
      nameEN: "Engineering Ethics & Professional Laws",
    },
    {
      id: "math",
      nameTH: "คณิตศาสตร์วิศวกรรมและสถิติ",
      nameEN: "Engineering Mathematics & Statistics",
    },
    {
      id: "economics",
      nameTH: "วิศวกรรมเศรษฐศาสตร์",
      nameEN: "Engineering Economics",
    },
    {
      id: "pm",
      nameTH: "การจัดการโครงการวิศวกรรม",
      nameEN: "Engineering Project Management",
    },
  ],
};

export function getBranchCategory(branchId: BranchId): Category {
  const branch = branches.find((b) => b.id === branchId)!;
  return {
    id: "branch",
    nameTH: `หมวดวิชาเฉพาะสาขา — ${branch.nameTH}`,
    nameEN: `Branch-Specific — ${branch.nameEN}`,
    subcategories: branchSpecificSubcategories[branchId],
  };
}

export function getBranchById(id: BranchId): Branch {
  return branches.find((b) => b.id === id) ?? branches[0];
}
