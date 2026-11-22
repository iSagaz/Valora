
const searchForm = document.querySelector('.search-form')
const productList = document.querySelector('.product-list')
const priceChat = document.querySelector('.price-chart')

let MyChart = null

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const inputValue = event.target[0].value.trim()

    if (!inputValue) return

    try {
        const response = await fetch(
            `https://dummyjson.com/products/search?q=${encodeURIComponent(inputValue)}&limit=10`
        )

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos')
        }

        const data = await response.json()
        const products = data.products

        displayItems(products)
        updatePriceChart(products)

    } catch (error) {
        console.error(error)
        productList.innerHTML = '<p>Não foi possível carregar os produtos.</p>'
    }
})

function displayItems(products) {
    if (products.length === 0) {
        productList.innerHTML = '<p>Nenhum produto encontrado.</p>'
        return
    }

    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="product-price">
                Preço: ${product.price.toLocaleString('pt-BR', {
                    style: "currency",
                    currency: "BRL"
                })}
            </p>
            <p class="product-store">
                Marca: ${product.brand || 'Não informada'}
            </p>
        </div>
    `).join('')
}

function updatePriceChart(products) {
    const ctx = priceChat.getContext('2d')

    if (MyChart) {
        MyChart.destroy()
    }

    MyChart = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: products.map(product =>
                product.title.length > 20
                    ? product.title.substring(0, 20) + '...'
                    : product.title
            ),

            datasets: [{
                label: 'Preço [R$]',
                data: products.map(product => product.price),
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: false
                },

                title: {
                    display: true,
                    text: 'Comparador de Preços',
                    font: {
                        size: 18
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function (value) {
                            return value.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })
                        }
                    }
                }
            }
        }
    })
}
