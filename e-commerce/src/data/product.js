const products = [
  {
    name: "Kaos Oversize",
    price: "Rp129.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Jaket Leather",
    price: "Rp349.000",
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sneakers",
    price: "Rp499.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Backpack",
    price: "Rp219.000",
    category: "Tas",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Jam Tangan",
    price: "Rp299.000",
    category: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Kacamata",
    price: "Rp159.000",
    category: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sandal Casual",
    price: "Rp189.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Celana Jeans",
    price: "Rp279.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sneakers White",
    price: "Rp449.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Tas Shoulder",
    price: "Rp239.000",
    category: "Tas",
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "T-Shirt Basic",
    price: "Rp119.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Jaket Denim",
    price: "Rp329.000",
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sneakers Casual",
    price: "Rp399.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Dompet Kulit",
    price: "Rp179.000",
    category: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Topi Casual",
    price: "Rp99.000",
    category: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Polo Shirt",
    price: "Rp199.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Tas Tote",
    price: "Rp169.000",
    category: "Tas",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Jam Classic",
    price: "Rp319.000",
    category: "Aksesori",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Blazer Formal",
    price: "Rp429.000",
    category: "Outerwear",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sepatu Casual",
    price: "Rp369.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sweater",
    price: "Rp249.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Sneakers Premium",
    price: "Rp529.000",
    category: "Sepatu",
    image:
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Backpack Canvas",
    price: "Rp229.000",
    category: "Tas",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Kemeja Casual",
    price: "Rp219.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Celana Casual",
    price: "Rp239.000",
    category: "Pakaian",
    image:
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop",
  },
];

export default products;