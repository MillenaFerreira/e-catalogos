import ProductDisplay from "../components/ProductDisplay";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <ProductDisplay />
    </div>
  );
};

export default Home;
