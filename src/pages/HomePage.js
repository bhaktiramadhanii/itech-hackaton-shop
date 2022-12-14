import React, { useState } from "react";
import Hero from "../components/home/hero/Hero";
import Navigation from "../components/home/navigation/Navigation";
import TopProduk from "../components/home/top-produk/TopProduk";
import Menu from "../components/home/menu/Menu";
import Footer from "../components/home/footer/Footer";
import "../assets/styles/styles.css";

const HomePage = ({ products }) => {
  const [position, setPosition] = useState(0);
  window.addEventListener("scroll", (e) => {
    setPosition(window.scrollY);
  });
  return (
    <>
      <div className="container">
        <button
          className="arrow-button"
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          style={{
            display: position > 100 ? "block" : "none",
          }}
        ></button>
        <div className="hero-wrapper">
          <Navigation />
          <Hero />
          <TopProduk products={products} />
          <Menu products={products} />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
