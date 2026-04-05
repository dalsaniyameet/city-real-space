const dotenv    = require('dotenv');
const connectDB = require('./config/db');
const User      = require('./models/User');
const Property  = require('./models/Property');
const Blog      = require('./models/Blog');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing
    await User.deleteMany();
    await Property.deleteMany();
    await Blog.deleteMany();

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin', lastName: 'CRS',
      email: 'patelshriji72@gmail.com', phone: '9876543210',
      password: 'CRS@Meet#2026!', role: 'admin', city: 'Ahmedabad'
    });

    // Sample properties
    const properties = [
      {
        title: 'Luxurious 3BHK Villa with Garden', priceLabel: '\u20b91.2 Cr', price: 12000000,
        type: 'villa', category: 'residential', status: 'for-sale',
        location: { area: 'Bopal', city: 'Ahmedabad' },
        specs: { beds: 3, baths: 2, sqft: 1850 },
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'],
        isFeatured: true, isApproved: true, agent: { name: 'Rahul K.', initials: 'RK', phone: '9876543210' },
        postedBy: admin._id
      },
      {
        title: 'Premium 2BHK Smart Apartment', priceLabel: '\u20b985 L', price: 8500000,
        type: 'apartment', category: 'residential', status: 'new-launch',
        location: { area: 'Giftcity', city: 'Gandhinagar' },
        specs: { beds: 2, baths: 2, sqft: 1200 },
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'],
        isFeatured: true, isApproved: true, agent: { name: 'Priya S.', initials: 'PS', phone: '9876543211' },
        postedBy: admin._id
      },
      {
        title: 'Ultra-Modern 4BHK Penthouse', priceLabel: '\u20b92.5 Cr', price: 25000000,
        type: 'apartment', category: 'residential', status: 'for-sale',
        location: { area: 'Prahlad Nagar', city: 'Ahmedabad' },
        specs: { beds: 4, baths: 3, sqft: 3200 },
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'],
        isFeatured: true, isApproved: true, agent: { name: 'Amit M.', initials: 'AM', phone: '9876543212' },
        postedBy: admin._id
      },
      {
        title: 'Spacious 3BHK Semi-Furnished Flat', priceLabel: '\u20b935K/mo', price: 35000,
        type: 'apartment', category: 'residential', status: 'for-rent',
        location: { area: 'Satellite', city: 'Ahmedabad' },
        specs: { beds: 3, baths: 2, sqft: 1650 },
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80'],
        isFeatured: true, isApproved: true, agent: { name: 'Neha K.', initials: 'NK', phone: '9876543213' },
        postedBy: admin._id
      },
      {
        title: 'Premium Office Space \u2013 3500 sqft', priceLabel: '\u20b92.8 Cr', price: 28000000,
        type: 'office', category: 'commercial', status: 'for-sale',
        location: { area: 'Prahlad Nagar', city: 'Ahmedabad' },
        specs: { beds: 0, baths: 0, sqft: 3500 },
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80'],
        isFeatured: true, isApproved: true, agent: { name: 'Raj S.', initials: 'RS', phone: '9876543214' },
        postedBy: admin._id
      },
      {
        title: 'Retail Shop in Prime Location', priceLabel: '\u20b985 L', price: 8500000,
        type: 'shop', category: 'commercial', status: 'for-sale',
        location: { area: 'CG Road', city: 'Ahmedabad' },
        specs: { beds: 0, baths: 0, sqft: 650 },
        images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80'],
        isFeatured: false, isApproved: true, agent: { name: 'Bhavesh T.', initials: 'BT', phone: '9876543215' },
        postedBy: admin._id
      }
    ];

    await Property.insertMany(properties);

    // ===== BLOG POSTS =====
    const blogs = [
      {
        title: 'Ahmedabad Real Estate Market Booming in 2025 \u2014 What Buyers Must Know',
        slug: 'ahmedabad-real-estate-market-2025',
        category: 'Market Insight',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        excerpt: 'Property prices in Ahmedabad have risen 18% in the last year. Here\'s a complete guide for first-time buyers navigating the current market.',
        content: '<h2>Ahmedabad Real Estate in 2025</h2><p>Property prices in Ahmedabad have risen 18% in the last year. The city is witnessing unprecedented growth driven by infrastructure development, IT sector expansion, and the GIFT City project.</p><h3>Key Areas to Watch</h3><p>Bopal, Shela, Thaltej, and Prahlad Nagar continue to be the hottest micro-markets. New launch projects in these areas are getting sold out within weeks of launch.</p><h3>What Buyers Must Know</h3><p>First-time buyers should focus on RERA-registered projects, check builder reputation, and always get a legal verification done before booking. Home loan interest rates are currently at 8.5-9% which is still favorable for buyers.</p><p>City Real Space recommends buyers to act now before prices rise further in Q3 2025.</p>',
        metaTitle: 'Ahmedabad Real Estate Market 2025 \u2013 Prices, Trends & Buyer Guide',
        metaDescription: 'Property prices in Ahmedabad rose 18% in 2025. Complete guide for buyers on best areas, RERA tips, and home loan advice from City Real Space.',
        isPublished: true
      },
      {
        title: '5 Things to Check Before Buying a Flat in Ahmedabad',
        slug: '5-things-check-before-buying-flat-ahmedabad',
        category: 'Tips',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        excerpt: 'From RERA registration to builder reputation \u2014 here\'s your complete checklist before buying a flat in Ahmedabad.',
        content: '<h2>Your Complete Flat Buying Checklist</h2><p>Buying a flat is one of the biggest financial decisions of your life. Here are 5 critical things you must verify before signing any agreement.</p><h3>1. RERA Registration</h3><p>Always verify the project\'s RERA registration on the Gujarat RERA website. A registered project ensures the builder is accountable and your investment is protected.</p><h3>2. Builder Reputation</h3><p>Check the builder\'s track record, past projects, and delivery timelines. Talk to residents of their previous projects.</p><h3>3. Legal Title Verification</h3><p>Get a lawyer to verify the land title, NOC from authorities, and approved building plan before booking.</p><h3>4. Location & Connectivity</h3><p>Check proximity to schools, hospitals, metro stations, and your workplace. Future infrastructure plans can significantly impact property value.</p><h3>5. Payment Plan & Hidden Charges</h3><p>Understand the complete payment schedule, maintenance charges, parking charges, and any other hidden costs before committing.</p>',
        metaTitle: '5 Things to Check Before Buying a Flat in Ahmedabad \u2013 City Real Space',
        metaDescription: 'Complete checklist for flat buyers in Ahmedabad. Check RERA registration, builder reputation, legal title, location & payment plan before buying.',
        isPublished: true
      },
      {
        title: 'Top 5 New Launch Projects in Giftcity 2025',
        slug: 'top-5-new-launch-projects-giftcity-2025',
        category: 'New Launch',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
        excerpt: 'GIFT City is becoming Gujarat\'s most sought-after investment destination. Here are the top 5 new launch projects you should consider.',
        content: '<h2>GIFT City \u2013 Gujarat\'s Investment Hub</h2><p>GIFT City (Gujarat International Finance Tec-City) has emerged as one of India\'s most exciting real estate destinations. With world-class infrastructure, tax benefits, and proximity to Ahmedabad, it offers unmatched investment potential.</p><h3>Why Invest in GIFT City?</h3><p>GIFT City offers special economic zone benefits, international standard infrastructure, and is home to major financial institutions and IT companies. Property values have appreciated 25% in the last 2 years.</p><h3>Top Projects to Consider</h3><p>Several premium developers have launched residential and commercial projects in GIFT City. These projects offer modern amenities, smart home features, and excellent rental yields for investors.</p><p>Contact City Real Space for exclusive pre-launch pricing and site visit arrangements.</p>',
        metaTitle: 'Top 5 New Launch Projects in GIFT City Gandhinagar 2025',
        metaDescription: 'Best new launch projects in GIFT City 2025. Premium residential & commercial properties with excellent investment potential. Free site visit available.',
        isPublished: true
      },
      {
        title: 'Why Bopal & Shela Are the Best Investment Areas Right Now',
        slug: 'bopal-shela-best-investment-areas-ahmedabad',
        category: 'Investment',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
        excerpt: 'High ROI, great connectivity and upcoming metro \u2014 here\'s why investors love Bopal and Shela in Ahmedabad.',
        content: '<h2>Bopal & Shela \u2013 Ahmedabad\'s Investment Hotspots</h2><p>Bopal and Shela have consistently ranked among the top investment destinations in Ahmedabad. Here\'s why smart investors are choosing these areas.</p><h3>Excellent Connectivity</h3><p>Both areas are well-connected to SG Highway, Sardar Patel Ring Road, and the upcoming metro line. The proposed metro station in Bopal will further boost property values.</p><h3>Strong ROI</h3><p>Properties in Bopal and Shela have delivered 12-15% annual appreciation over the last 5 years. Rental yields are also strong at 3-4% per annum.</p><h3>Quality of Life</h3><p>These areas offer excellent schools, hospitals, malls, and recreational facilities. The green environment and planned development make them ideal for families.</p><p>City Real Space has exclusive listings in Bopal and Shela. Contact us for the best deals.</p>',
        metaTitle: 'Bopal & Shela Ahmedabad \u2013 Best Investment Areas 2025 | City Real Space',
        metaDescription: 'Why Bopal and Shela are top investment areas in Ahmedabad. High ROI, metro connectivity, quality schools & hospitals. Best properties available.',
        isPublished: true
      },
      {
        title: 'Home Loan Guide 2025 \u2014 Best Banks & Interest Rates in India',
        slug: 'home-loan-guide-2025-best-banks-interest-rates',
        category: 'Home Loan',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
        excerpt: 'Compare SBI, HDFC, ICICI home loan rates and choose the best option for your property purchase in 2025.',
        content: '<h2>Home Loan Guide 2025</h2><p>Getting the right home loan can save you lakhs of rupees over the loan tenure. Here\'s a comprehensive guide to help you choose the best home loan in 2025.</p><h3>Current Interest Rates</h3><p>SBI is offering home loans at 8.50% p.a., HDFC at 8.75% p.a., ICICI Bank at 8.75% p.a., and Axis Bank at 8.75% p.a. These rates are subject to change based on RBI policy.</p><h3>How to Choose the Right Bank</h3><p>Consider the interest rate, processing fees, prepayment charges, and customer service quality. Also check if the bank offers balance transfer facility at lower rates.</p><h3>Documents Required</h3><p>You will need identity proof, address proof, income documents (salary slips or ITR), bank statements, and property documents for home loan application.</p><p>City Real Space has tie-ups with 15+ banks. We can help you get the best home loan deal. Contact us for free consultation.</p>',
        metaTitle: 'Home Loan Guide 2025 \u2013 Best Banks & Interest Rates | City Real Space',
        metaDescription: 'Compare home loan interest rates from SBI, HDFC, ICICI in 2025. Get free home loan consultation from City Real Space. Best rates guaranteed.',
        isPublished: true
      },
      {
        title: 'RERA Gujarat \u2014 Everything a Property Buyer Must Know in 2025',
        slug: 'rera-gujarat-property-buyer-guide-2025',
        category: 'Legal',
        author: 'CRS Team',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
        excerpt: 'Understanding RERA registration, complaints and buyer rights in Gujarat. Complete guide for property buyers.',
        content: '<h2>RERA Gujarat \u2013 Protecting Property Buyers</h2><p>The Real Estate (Regulation and Development) Act, 2016 (RERA) has transformed the real estate sector in India. Here\'s everything you need to know as a property buyer in Gujarat.</p><h3>What is RERA?</h3><p>RERA is a regulatory body that ensures transparency, accountability, and efficiency in the real estate sector. All projects above 500 sq meters or 8 units must be registered with RERA.</p><h3>How to Verify RERA Registration</h3><p>Visit the Gujarat RERA website (gujrera.gujarat.gov.in) and search for the project by name or registration number. Always verify before booking.</p><h3>Buyer Rights Under RERA</h3><p>As a buyer, you have the right to get possession on time, receive compensation for delays, get refund with interest if the project is cancelled, and file complaints against builders.</p><h3>How to File a Complaint</h3><p>If a builder violates RERA norms, you can file a complaint on the Gujarat RERA portal. The authority will investigate and take action within 60 days.</p><p>All properties listed on City Real Space are RERA verified. Contact us for legal assistance.</p>',
        metaTitle: 'RERA Gujarat 2025 \u2013 Complete Guide for Property Buyers | City Real Space',
        metaDescription: 'Complete RERA Gujarat guide for property buyers. How to verify registration, file complaints, and protect your investment. All CRS properties are RERA verified.',
        isPublished: true
      }
    ];

    await Blog.insertMany(blogs);

    console.log('\u2705 Seed data inserted successfully!');
    console.log('Admin Email: admin@cityrealspace.com');
    console.log('Admin Password: admin123');
    console.log('\u2705 6 Blog posts added!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seedData();
