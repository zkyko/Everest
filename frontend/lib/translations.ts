export const translations = {
    en: {
        // Navigation
        nav: {
            home: 'Home',
            menu: 'Menu',
            cart: 'Cart',
            orders: 'Orders',
            profile: 'Profile',
        },
        // Home Page
        home: {
            heroTitle: 'Everest',
            heroSubtitle: 'Authentic Nepalese Street Food',
            orderNow: 'Order Takeout',
            viewMenu: 'View Menu',
            popularItems: 'Popular Items',
            seeAll: 'See All',
            open: 'Open',
            closed: 'Closed',
            waitTime: 'Wait Time',
            pickupOnly: 'Pickup only — no dine-in reservations',
            address: '1310 West Howard Lane',
            city: 'Austin, TX 78728',
            footerCredit: 'Powered by Everest Food Truck OS',
        },
        // Menu Page
        menu: {
            categories: 'Categories',
            addToCart: 'Add to Cart',
            searchPlaceholder: 'Search for food...',
        },
        // Status Labels
        status: {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
            veryHigh: 'Very High',
        },
        // Cart Page
        cart: {
            title: 'Cart',
            emptyTitle: 'Your Cart is Empty',
            emptySubtitle: 'Start adding delicious items from our menu',
            browseMenu: 'Browse Menu',
            summary: 'Summary',
            subtotal: 'Subtotal',
            tax: 'Tax',
            total: 'Total',
            checkout: 'Proceed to Checkout',
            clear: 'Clear All',
            pickupEstimate: 'Estimated pickup',
            minutes: 'min',
        },
        // Checkout Page
        checkout: {
            title: 'Checkout',
            details: 'Order Details',
            payment: 'Payment',
            placeOrder: 'Place Order',
            name: 'Name',
            phone: 'Phone',
            email: 'Email',
            specialInstructions: 'Special Instructions',
        }
    },
    ne: {
        // ... (existing nav, home, menu)
        nav: {
            home: 'होम',
            menu: 'मेनु',
            cart: 'झोला',
            orders: 'अर्डरहरू',
            profile: 'प्रोफाइल',
        },
        home: {
            heroTitle: 'एभरेष्ट',
            heroSubtitle: 'प्रामाणिक नेपाली खाजा',
            orderNow: 'अर्डर गर्नुहोस्',
            viewMenu: 'मेनु हेर्नुहोस्',
            popularItems: 'लोकप्रिय परिकार',
            seeAll: 'सबै हेर्नुहोस्',
            open: 'खुला छ',
            closed: 'बन्द छ',
            waitTime: 'प्रतीक्षा समय',
            pickupOnly: 'पिकअप मात्र — डाइन-इन आरक्षण छैन',
            address: '१३१० वेस्ट हावर्ड लेन',
            city: 'अस्टिन, टेक्सास ७८७२८',
            footerCredit: 'एभरेष्ट फूड ट्रक ओएस द्वारा संचालित',
        },
        menu: {
            categories: 'कोटिहरू',
            addToCart: 'थप्नुहोस्',
            searchPlaceholder: 'खाना खोज्नुहोस्...',
        },
        // Status Labels
        status: {
            low: 'न्यून',
            medium: 'मध्यम',
            high: 'उच्च',
            veryHigh: 'धेरै उच्च',
        },
        // Cart Page
        cart: {
            title: 'झोला',
            emptyTitle: 'तपाईंको झोला खाली छ',
            emptySubtitle: 'हाम्रो मेनुबाट स्वादिष्ट परिकारहरू थप्न सुरु गर्नुहोस्',
            browseMenu: 'मेनु हेर्नुहोस्',
            summary: 'सारांश',
            subtotal: 'उप-कुल',
            tax: 'कर',
            total: 'कुल',
            checkout: 'चेकआउटमा जानुहोस्',
            clear: 'सबै हटाउनुहोस्',
            pickupEstimate: 'अनुमानित समय',
            minutes: 'मिनेट',
        },
        // Checkout Page
        checkout: {
            title: 'चेकआउट',
            details: 'अर्डर विवरण',
            payment: 'भुक्तानी',
            placeOrder: 'अर्डर गर्नुहोस्',
            name: 'नाम',
            phone: 'फोन',
            email: 'इमेल',
            specialInstructions: 'विशेष निर्देशन',
        }
    }
}

export type TranslationKeys = typeof translations.en
