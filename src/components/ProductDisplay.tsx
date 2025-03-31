import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaInfo, FaMinus, FaPlus, FaSearch, FaShoppingCart, FaSyncAlt } from 'react-icons/fa';
import Modal from "../components/modal/Modal";
import productsData from "../data/products.json";
import styles from "./productDisplay.module.css";

// Obtendo os produtos e as categorias únicas a partir do JSON
const products = productsData.products;
const categories = Array.from(new Set(products.map((product) => product.category)));

export default function ProductDisplay() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [productIndex, setProductIndex] = useState(0);
  const [accumulatedTotal, setAccumulatedTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  const [size, setSize] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchRef, setSearchRef] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [productTotals, setProductTotals] = useState<{ [key: string]: number }>({});

  // Filtra os produtos pela categoria selecionada
  const filteredProducts = products.filter((product) => product.category === selectedCategory);
  const product = filteredProducts[productIndex];

  // Filtra os produtos pela categoria selecionada
  const quantity = product ? (quantities[product.reference] || 0) : 0;
  const price = product ? product.price : 0;
  const total = quantity * price;

  // Obtém a quantidade e o preço do produto atual
  const sizes = product ? product.skus.map(sku => ({
    size: sku.size,
    quantity: sku.stock
  })) : [];

  // Atualiza o total acumulado quando o total de um produto muda
  useEffect(() => {
    const currentTotal = productTotals[product.reference] || 0;
    if (currentTotal !== total) {
      setProductTotals(prev => ({
        ...prev,
        [product.reference]: total
      }));

      setAccumulatedTotal(prev => prev + (total - currentTotal));
    }
  }, [total]);

  // Alterna entre as categorias
  const changeCategory = (direction: number) => {
    const currentIndex = categories.indexOf(selectedCategory);
    setSelectedCategory(categories[(currentIndex + direction + categories.length) % categories.length]);
    setProductIndex(0);
    setSelectedImage("");
  };

  // Alterna entre os produtos dentro das categorias
  const changeProduct = (direction: number) => {
    let newProductIndex = productIndex + direction;

    if (newProductIndex < 0) {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      const prevCategoryIndex = (currentCategoryIndex - 1 + categories.length) % categories.length;
      setSelectedCategory(categories[prevCategoryIndex]);
      newProductIndex = products.filter(p => p.category === categories[prevCategoryIndex]).length - 1;
    } else if (newProductIndex >= filteredProducts.length) {
      const currentCategoryIndex = categories.indexOf(selectedCategory);
      const nextCategoryIndex = (currentCategoryIndex + 1) % categories.length;
      setSelectedCategory(categories[nextCategoryIndex]);
      newProductIndex = 0;
    }

    setProductIndex(newProductIndex);
    setSelectedImage("");
  };

  // Filtra o produto pela referência informada no input
  const filterProductByRef = (ref: string) => {
    const trimmedRef = ref.trim();
    if (trimmedRef === "") {
      setErrorMessage("Por favor, insira uma referência válida.");
      return;
    }

    const foundProduct = products.find(product => product.reference === trimmedRef);
    if (!foundProduct) {
      setErrorMessage("Produto não encontrado com essa referência.");
      return;
    }

    const foundCategory = foundProduct.category;
    setSelectedCategory(foundCategory);

    const categoryProducts = products.filter(product => product.category === foundCategory);
    const foundIndex = categoryProducts.findIndex(product => product.reference === trimmedRef);

    setProductIndex(foundIndex);
    setErrorMessage("");
    setIsSearchModalOpen(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <FaAngleLeft className={styles.back} />
        <div className={styles.category}>
          <FaAngleLeft className={styles.navIcon} onClick={() => changeCategory(-1)} />
          <span>{selectedCategory}</span>
          <FaAngleRight className={styles.navIcon} onClick={() => changeCategory(1)} />
        </div>
        <div className={styles.userIcon}><span>F</span></div>
      </div>

      {/* Imagem Principal */}
      <div className={styles.image_container}>
        <FaAngleLeft className={styles.navIconImage} onClick={() => changeProduct(-1)} />
        <img src={selectedImage || (product && product.images[0].path)} alt={product ? product.name : "Produto"} />
        <FaAngleRight className={styles.navIconImage} onClick={() => changeProduct(1)} />
      </div>

      {/* Miniaturas e Ações */}
      <div className={styles.thumbnails}>
        <FaInfo className={styles.icon} onClick={() => setIsModalOpen(true)} />
        <FaSearch className={styles.icon} onClick={() => setIsSearchModalOpen(true)} />
        {product && product.images.map((image, index) => (
          <img
            key={index}
            src={image.path}
            alt={`Thumbnail ${index}`}
            className={styles.thumbnail}
            onClick={() => setSelectedImage(image.path)}
          />
        ))}
        <FaShoppingCart className={styles.icon} style={{ cursor: "not-allowed" }} />
      </div>

      <span className={styles.illustration}>Preços ilustrativos</span>

      {/* Detalhes do Produto */}
      <div className={styles.details}>
        <div className={styles.info}>
          <div><FaSyncAlt /><span>{product ? product.name : "Produto"}</span></div>
          <div><span>REF:</span><span>{product ? product.reference : "N/A"}</span></div>
          <div><span>R$</span><span>{price.toFixed(2)}</span></div>
        </div>

        {/* Preço Atual, Controle de Quantidade e Acumulado na mesma linha */}
        <div className={styles.price}>
          <div className={styles.current}>
            <span><strong>Atual</strong></span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className={styles.quantityControl}>
            <FaMinus className={styles.icon} onClick={() => {
              setQuantities(prev => ({
                ...prev,
                [product.reference]: Math.max(0, (prev[product.reference] || 0) - 1)
              }));
            }} />
            <span>{quantity}</span>
            <FaPlus className={styles.icon} onClick={() => {
              setQuantities(prev => ({
                ...prev,
                [product.reference]: (prev[product.reference] || 0) + 1
              }));
            }} />
          </div>
          <div className={styles.current}>
            <span><strong>Acumulado</strong></span>
            <span>R$ {accumulatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Seleção de Tamanho */}
      <div className={styles.footer}>
        <div className={styles.size_selector}>
          <div className={styles.size_options}>
            {sizes.map((s) => (
              <div
                key={s.size}
                className={`${styles.size_option} ${s.size === size ? styles.selected : ""}`}
                onClick={() => setSize(s.size)}
              >
                {s.quantity}
                <span className={styles.size_quantity}>{s.size}</span>
              </div>
            ))}
            <span className={styles.equal}> = </span>
            <div className={styles.pack_quantity}>
              <span className={styles.pack_title}>PACK</span>
              <span>18</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Informações */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} title="Informações">
          <div className={styles.information}>
            <div className={styles.colors}><p><strong>Cores</strong> {product ? product.colors.join(", ") : "N/A"}</p></div>
            <div><p><strong>Nome:</strong> {product ? product.name : "Produto"}</p></div>
            <div><p><strong>Referência:</strong> {product ? product.reference : "N/A"}</p></div>
            <div><p><strong>Marca:</strong> {product ? product.brand : "N/A"}</p></div>
            <div><p><strong>Categoria:</strong> {product ? product.category : "N/A"}</p></div>
            <div><p><strong>Gênero:</strong> {product ? product.gender : "N/A"}</p></div>
          </div>
        </Modal>
      )}

      {/* Modal de Pesquisa */}
      {isSearchModalOpen && (
        <Modal isOpen={isSearchModalOpen} closeModal={() => {
          setIsSearchModalOpen(false);
          setSearchRef("");
        }} title="BUSCAR POR REF">
          <div className={styles.searchContainer}>
            <input
              type="text"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              placeholder="00.00.000"
              className={styles.searchInput}
            />
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            <button onClick={() => filterProductByRef(searchRef)} className={styles.searchButton}>Buscar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
