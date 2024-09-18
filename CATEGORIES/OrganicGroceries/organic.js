document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    // Loop through each product card and add hover effect
    productCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            const productName = card.querySelector('.product-name').textContent;
            console.log(`Hovered over: ${productName}`);
        });

        card.addEventListener('mouseout', () => {
            console.log('Mouse out from product card');
        });
    });
});
