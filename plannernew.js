const DATA_STORE = {
    categories: {
        electronics: {
            gst: 18,
            items: ["Laptop", "Smartphone", "Tablet", "Smart TV", "Headphones", "Gaming Console", "Smartwatch", "Camera", "Refrigerator", "Washing Machine", "Air Conditioner"]
        },
        home: {
            gst: 12,
            items: ["Furniture", "Cookware", "Home Decor", "Mattress"]
        },
        travel: {
            gst: 5,
            items: ["Flight Ticket", "Hotel Booking", "Holiday Package"]
        },
        others: {
            gst: 10,
            items: [] // Empty since we use a custom input
        }
    },
    offers: [
        { bank: "Axis Bank", benefit: "10% Instant Discount", type: "credit", cat: "electronics" },
        { bank: "HDFC Bank", benefit: "₹5,000 Cashback", type: "credit", cat: "electronics" },
        { bank: "ICICI Amazon", benefit: "5% Unlimited Rewards", type: "credit", cat: "any" },
        { bank: "SBI Card", benefit: "8% Travel Voucher", type: "any", cat: "travel" }
    ]
};

function updateItemOptions() {
    const cat = document.getElementById('itemCategory').value;
    const subSelect = document.getElementById('itemSubCategory');
    const customInput = document.getElementById('itemCustomName'); // Added

    if (cat === 'others') {
        // Show input, hide dropdown
        subSelect.style.display = 'none';
        customInput.style.display = 'block';
    } else {
        // Show dropdown, hide input
        subSelect.style.display = 'block';
        customInput.style.display = 'none';
        subSelect.innerHTML = DATA_STORE.categories[cat].items
            .map(item => `<option value="${item}">${item}</option>`).join('');
    }
}

function formatCurrency(num) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

function analyzePurchase() {
    const price = parseFloat(document.getElementById('purchasePrice').value);
    if (!price || price <= 0) {
        alert("Please enter a valid purchase price.");
        return;
    }
    const cat = document.getElementById('itemCategory').value;
    const customInputName = document.getElementById('itemCustomName').value.trim();
    if (cat === 'others' && !customInputName) {
        alert("Please enter item name");
        return;
    }

    // UI Loading State
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');
    const strategyCard = document.getElementById('strategyCard');
    
    loader.style.display = 'block';
    resultCard.style.display = 'none';
    strategyCard.style.display = 'none';

    setTimeout(() => {
        loader.style.display = 'none';
        calculate(price);
    }, 800);
}

function calculate(price) {
    const catKey = document.getElementById('itemCategory').value;
    const payMethod = document.querySelector('input[name="payMethod"]:checked').value;
    const gstRate = DATA_STORE.categories[catKey].gst;

    // Calculation Logic
    const gstAmt = price - (price * (100 / (100 + gstRate)));
    const gstSavings = gstAmt; // Potential business ITC
    
    let paySavingsPercent = 0;
    if (catKey === 'others') {
        // New logic for 'Others'
        if (payMethod === 'credit') paySavingsPercent = 0.10;
        else if (payMethod === 'debit') paySavingsPercent = 0.05;
        else if (payMethod === 'upi') paySavingsPercent = 0.02; // Future-proof if UPI is separated
        else if (payMethod === 'cash') paySavingsPercent = 0.00;
    }else if(payMethod === 'credit') {
        paySavingsPercent = catKey === 'electronics' ? 0.10 : 0.05;
    } else if (payMethod === 'debit') {
        paySavingsPercent = 0.02;
    }
    
    // Bonus for high value
    if (price > 50000 && payMethod === 'credit') paySavingsPercent += 0.02;

    const paySavingsAmt = price * paySavingsPercent;
    const totalSavings = gstSavings + paySavingsAmt;
    const finalCost = price - totalSavings;

    // Update UI
    document.getElementById('resOriginal').innerText = formatCurrency(price);
    document.getElementById('resGstRate').innerText = gstRate;
    document.getElementById('resGstAmt').innerText = formatCurrency(gstAmt);
    document.getElementById('resGstSave').innerText = `-${formatCurrency(gstSavings)}`;
    document.getElementById('resPaySave').innerText = `-${formatCurrency(paySavingsAmt)}`;
    document.getElementById('resFinal').innerText = formatCurrency(finalCost);

    // Dynamic Insights
    const insightBox = document.getElementById('smartInsight');
    const savingsPercent = ((totalSavings / price) * 100).toFixed(1);
    let customLabelHTML = "";
    if (catKey === 'others') {
        const customName = document.getElementById('itemCustomName').value.trim();
        customLabelHTML = `<div style="color: var(--primary-dark); font-weight: 700; margin-bottom: 8px;">👉 Custom Purchase: ${customName}</div>`;
    }
    insightBox.innerHTML = `${customLabelHTML}<strong>Smart Insight:</strong> You are saving ${savingsPercent}% through EveryRupee optimizations. ${price > 50000 ? "Consider a 6-month No-Cost EMI to keep your cash flow healthy." : "Great deal! This purchase is within optimal budget limits."}`;
    // Bank Strategy
    const bankOffersDiv = document.getElementById('bankOffers');
    const relevantOffers = DATA_STORE.offers.filter(o => o.cat === catKey || o.cat === 'any');
    bankOffersDiv.innerHTML = relevantOffers.map(o => `
        <div class="bank-offer-item">
            <div>
                <span class="bank-name">${o.bank}</span>
                <span class="bank-benefit">Special offer for ${o.type} cards</span>
            </div>
            <span class="benefit-tag">${o.benefit}</span>
        </div>
    `).join('');

    // Show Results with simple animation
    const resultCard = document.getElementById('resultCard');
    const strategyCard = document.getElementById('strategyCard');
    resultCard.style.display = 'block';
    strategyCard.style.display = 'block';
    resultCard.style.opacity = 0;
    setTimeout(() => resultCard.style.opacity = 1, 50);
}

// Initial Load
updateItemOptions();