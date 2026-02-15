import { useState, useEffect } from 'react';
import { productsConfig } from '@/config/productsConfig';

const DATA_VERSION = '1.1'; 

export const useProductsData = () => {
    const [products, setProducts] = useState(() => {
        try {
            const savedData = localStorage.getItem('avyra-products-visibility');
            if (savedData) {
                const { version, data } = JSON.parse(savedData);
                if (version === DATA_VERSION) {
                    const allProductIds = productsConfig.map(p => p.id);
                    const savedProductIds = data.map(p => p.id);
                    
                    const updatedProducts = productsConfig.map(p => {
                        const saved = data.find(sp => sp.id === p.id);
                        return saved ? { ...p, available: saved.available } : p;
                    });

                    const newProducts = productsConfig.filter(p => !savedProductIds.includes(p.id));
                    
                    return [...updatedProducts, ...newProducts];
                }
            }
        } catch (error) {
            console.error("Failed to parse products from localStorage", error);
        }
        return productsConfig;
    });

    useEffect(() => {
        try {
            const dataToSave = {
                version: DATA_VERSION,
                data: products.map(p => ({ id: p.id, available: p.available }))
            };
            localStorage.setItem('avyra-products-visibility', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save products to localStorage", error);
        }
    }, [products]);

    const toggleProductAvailability = (productId) => {
        setProducts(currentProducts =>
            currentProducts.map(p =>
                p.id === productId ? { ...p, available: !p.available } : p
            )
        );
    };

    return { products, toggleProductAvailability };
};