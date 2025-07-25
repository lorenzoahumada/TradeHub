function ProductCard({product}) {
  return (
    <div className='card'>
        <div className='card-body'>
            <p>Usuario</p>
            <h3 className='card-title mb-3'>{product.name}</h3>
            <img src={product.images[0]} alt="Producto 1" className='card-img-top border border-dark mb-3' />
            <p className='card-text h3'>$ {product.price}</p>
            <button className='btn btn-secondary'>Ver más</button>
        </div>
    </div>
  );
}

export default ProductCard;