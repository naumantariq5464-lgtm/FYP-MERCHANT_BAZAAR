"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import "@/styles/docs.css";

const DOC_SECTIONS = [
  {
    id: "getting-started",
    title: "1. Getting Started",
    items: [
      { id: "overview", label: "Platform Overview" },
      { id: "create-store", label: "Create Your Store in 2 Mins" },
      { id: "dashboard-tour", label: "Seller Dashboard Tour" },
    ],
  },
  {
    id: "managing-store",
    title: "2. Products & Customization",
    items: [
      { id: "adding-products", label: "Adding Products & Sizes" },
      { id: "store-branding", label: "Store Logo & Themes" },
      { id: "policy-upload", label: "Brand Policy PDF Upload" },
    ],
  },
  {
    id: "ai-shopping",
    title: "3. AI Voice Shopping Agent",
    items: [
      { id: "voice-shopping", label: "How Voice Shopping Works" },
      { id: "policy-answers", label: "Damaged Order & Refund Answers" },
      { id: "voice-checkout", label: "Hands-Free Voice Checkout" },
    ],
  },
  {
    id: "order-management",
    title: "4. Orders & Fulfillment",
    items: [
      { id: "manage-orders", label: "Viewing & Dispatching Orders" },
    ],
  },
  {
    id: "security",
    title: "5. Security & Trust",
    items: [
      { id: "data-protection", label: "100% Private Store Data" },
      { id: "secure-account", label: "Account & Password Protection" },
    ],
  },
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentItemLabel =
    DOC_SECTIONS.flatMap((s) => s.items).find((i) => i.id === activeTab)?.label ||
    "Overview";

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="docs-page-wrapper">
      <Navbar />

      {/* Mobile Sticky Quick Navigation Bar */}
      <div className="docs-mobile-bar">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="docs-mobile-toggle-btn"
          aria-label="Open documentation navigation menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>Docs Menu</span>
        </button>
        <span className="docs-mobile-active-label">{currentItemLabel}</span>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div
          className="docs-mobile-drawer-overlay"
          onClick={() => setMobileDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="docs-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="docs-drawer-header">
              <span className="docs-drawer-title">User Guide</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="docs-drawer-close"
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <div className="docs-drawer-scroll">
              {DOC_SECTIONS.map((sec) => (
                <div key={sec.id} className="docs-nav-group">
                  <span className="docs-group-title">{sec.title}</span>
                  <ul className="docs-group-list">
                    {sec.items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          className={`docs-nav-item ${
                            activeTab === item.id ? "docs-nav-item-active" : ""
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="docs-container">
        {/* Left Sticky Sidebar Navigation */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-header">
            <span className="docs-badge">USER GUIDE</span>
            <h2 className="docs-sidebar-title">Merchant Bazaar</h2>
            <p className="docs-sidebar-sub">Everything you need to launch &amp; sell</p>
          </div>

          <nav className="docs-nav">
            {DOC_SECTIONS.map((sec) => (
              <div key={sec.id} className="docs-nav-group">
                <span className="docs-group-title">{sec.title}</span>
                <ul className="docs-group-list">
                  {sec.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`docs-nav-item ${
                          activeTab === item.id ? "docs-nav-item-active" : ""
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="docs-sidebar-footer">
            <Link href="/" className="docs-back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </aside>

        {/* Right Main Documentation Content */}
        <main className="docs-content">
          {/* Breadcrumb Header */}
          <div className="docs-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Documentation</span>
            <span>/</span>
            <span className="docs-crumb-active">Merchant &amp; Shopper Guide</span>
          </div>

          {/* Section 1: Getting Started */}
          <section id="overview" className="docs-article">
            <span className="docs-tag">GETTING STARTED</span>
            <h1 className="docs-h1">Platform Overview</h1>
            <p className="docs-lead">
              Merchant Bazaar is an intelligent digital store platform that allows you to launch your branded online storefront in seconds — equipped with an autonomous real-time Voice AI sales assistant.
            </p>
            <p>
              Traditional online shopping forces customers to search through dozens of categories and endless filters. In Merchant Bazaar, customers can simply speak naturally to your AI Sales Agent, ask for recommendations, choose product sizes, and complete checkouts hands-free.
            </p>

            <div className="docs-grid-cards">
              <div className="docs-card">
                <h3>Branded Digital Store</h3>
                <p>Get a unique online store URL under your own brand name where customers can browse and buy.</p>
              </div>
              <div className="docs-card">
                <h3>Real-Time Voice Assistant</h3>
                <p>An intelligent AI agent on your website that talks to customers, answers questions, and adds items to the cart.</p>
              </div>
              <div className="docs-card">
                <h3>Complete Seller Control</h3>
                <p>Manage your products, stock, prices, orders, and customer policy documents directly from your Seller Dashboard.</p>
              </div>
            </div>
          </section>

          <section id="create-store" className="docs-article">
            <h2 className="docs-h2">Create Your Store in 2 Minutes</h2>
            <p>Starting your online business takes just three simple steps:</p>
            <ol className="docs-ordered-steps">
              <li>
                <strong>Register Your Account:</strong> Click &ldquo;Create Your Store&rdquo; on the homepage. Enter your business name, choose your unique store link, and set a secure password.
              </li>
              <li>
                <strong>Add Products &amp; Prices:</strong> Open your Seller Dashboard, upload product photos, write titles, and set stock quantities and size variants.
              </li>
              <li>
                <strong>Go Live:</strong> Click &ldquo;Publish Store&rdquo; in your dashboard. Your branded store is immediately live and ready to take customer orders.
              </li>
            </ol>
          </section>

          <section id="dashboard-tour" className="docs-article">
            <h2 className="docs-h2">Seller Dashboard Tour</h2>
            <p>
              Your dashboard gives you full control over your business in one simple place:
            </p>
            <div className="docs-grid-cards">
              <div className="docs-card">
                <h3>📦 Products &amp; Stock</h3>
                <p>View all products, edit prices, update stock levels, and organize products into categories.</p>
              </div>
              <div className="docs-card">
                <h3>🛒 Order Management</h3>
                <p>Track incoming customer orders, review delivery addresses, and mark packages as dispatched.</p>
              </div>
              <div className="docs-card">
                <h3>🎨 Store Appearance</h3>
                <p>Customize your store logo, main brand colors, and promotional announcement banners.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Products & Customization */}
          <section id="adding-products" className="docs-article">
            <span className="docs-tag">PRODUCTS &amp; INVENTORY</span>
            <h1 className="docs-h1">Adding Products &amp; Sizes</h1>
            <p className="docs-lead">
              List simple products or items with multiple sizes and colors.
            </p>
            <p>
              When adding a product to your catalog, you can provide:
            </p>
            <ul>
              <li><strong>Product Title &amp; Description:</strong> Clear details so your customers and the AI agent know what you are selling.</li>
              <li><strong>Product Photos:</strong> High-resolution photos that display cleanly in the product gallery.</li>
              <li><strong>Sizes &amp; Color Variants:</strong> Specify options like Small, Medium, Large, or color choices with separate prices if needed.</li>
              <li><strong>Stock Tracking:</strong> Keep track of available quantities so you never oversell out-of-stock items.</li>
            </ul>
          </section>

          <section id="store-branding" className="docs-article">
            <h2 className="docs-h2">Store Logo &amp; Brand Themes</h2>
            <p>
              Make your storefront look unique to match your brand identity:
            </p>
            <ul>
              <li><strong>Store Logo:</strong> Appears cleanly on the storefront header and invoice receipts.</li>
              <li><strong>Brand Theme Color:</strong> Choose your brand&apos;s primary color for buttons, price highlights, and badges.</li>
              <li><strong>Announcement Banner:</strong> Display top promotional alerts such as &ldquo;Free Delivery on orders above $50&rdquo; or seasonal discount codes.</li>
            </ul>
          </section>

          <section id="policy-upload" className="docs-article">
            <h2 className="docs-h2">Brand Policy PDF Upload</h2>
            <p className="docs-lead">
              Upload your official store policy PDF so your AI Sales Agent knows your exact refund, return, and replacement rules.
            </p>
            <p>
              Every business has its own policies regarding refund conditions, return timeframes, and damaged order claims. Rather than answering repetitive phone calls or emails, you can upload your store&apos;s Policy Document (PDF) directly from your dashboard:
            </p>
            <ol className="docs-ordered-steps">
              <li>
                <strong>Prepare Your Policy Document:</strong> Create a standard PDF with your refund rules, return deadlines (e.g., 7 days or 14 days), and damaged item procedures.
              </li>
              <li>
                <strong>Upload in Dashboard:</strong> Go to Store Settings &rarr; Brand Policy &rarr; Upload PDF.
              </li>
              <li>
                <strong>Instant AI Grounding:</strong> Your AI Sales Agent reads your document. When customers ask about refunds, broken packages, or exchanges, the AI answers strictly from your verified document.
              </li>
            </ol>
          </section>

          {/* Section 3: AI Voice Shopping Agent */}
          <section id="voice-shopping" className="docs-article">
            <span className="docs-tag">AI SALES AGENT</span>
            <h1 className="docs-h1">How Voice Shopping Works</h1>
            <p className="docs-lead">
              Your shoppers can speak to your store naturally — just like speaking to a real salesperson in a physical shop.
            </p>
            <p>
              When a customer visits your online store, they can click the microphone button and talk:
            </p>
            <div className="docs-dialogue-box">
              <div className="docs-msg docs-msg-user">
                <strong>Customer:</strong> &ldquo;Show me summer linen shirts in green, size Medium.&rdquo;
              </div>
              <div className="docs-msg docs-msg-agent">
                <strong>AI Sales Agent:</strong> &ldquo;Here is our Emerald Linen Shirt in size Medium for $28! It is currently in stock. Would you like me to add it to your cart?&rdquo;
              </div>
            </div>
          </section>

          <section id="policy-answers" className="docs-article">
            <h2 className="docs-h2">Damaged Order &amp; Refund Answers</h2>
            <p>
              When customers have questions about broken parcels, returns, or warranty claims, the AI Agent retrieves the verified answer directly from your uploaded Policy PDF:
            </p>
            <div className="docs-dialogue-box">
              <div className="docs-msg docs-msg-user">
                <strong>Customer:</strong> &ldquo;What happens if my item arrives damaged or broken in the mail?&rdquo;
              </div>
              <div className="docs-msg docs-msg-agent">
                <strong>AI Sales Agent:</strong> &ldquo;According to this store&apos;s Return Policy: If your item arrives damaged, submit a photo of the package within 7 days of delivery. The store will send a free replacement or issue a full refund immediately.&rdquo;
              </div>
              <div className="docs-msg docs-msg-user">
                <strong>Customer:</strong> &ldquo;Can I return the shirt if the size doesn&apos;t fit?&rdquo;
              </div>
              <div className="docs-msg docs-msg-agent">
                <strong>AI Sales Agent:</strong> &ldquo;Yes! Unworn items with original tags can be exchanged or returned within 14 days of purchase.&rdquo;
              </div>
            </div>

            <div className="docs-callout docs-callout-info">
              <div className="docs-callout-icon">🛡️</div>
              <div className="docs-callout-body">
                <strong>Zero False Promises:</strong> Because your AI agent only answers from your uploaded PDF, it will never promise discounts or return timelines that contradict your verified business policy.
              </div>
            </div>
          </section>

          <section id="voice-checkout" className="docs-article">
            <h2 className="docs-h2">Hands-Free Voice Checkout</h2>
            <p>
              Customers do not need to click through complicated buttons. When ready to purchase:
            </p>
            <div className="docs-dialogue-box">
              <div className="docs-msg docs-msg-user">
                <strong>Customer:</strong> &ldquo;Yes, add this to my cart and proceed to checkout.&rdquo;
              </div>
              <div className="docs-msg docs-msg-agent">
                <strong>AI Sales Agent:</strong> &ldquo;Added to your shopping cart! Opening your checkout order form right now.&rdquo;
              </div>
            </div>
            <p>
              The shopping cart drawer slides open automatically, and the checkout page prepares the customer&apos;s selected items and sizes instantly.
            </p>
          </section>

          {/* Section 4: Orders & Fulfillment */}
          <section id="manage-orders" className="docs-article">
            <span className="docs-tag">ORDER MANAGEMENT</span>
            <h1 className="docs-h1">Viewing &amp; Dispatching Orders</h1>
            <p className="docs-lead">
              Receive customer orders in real-time and fulfill them smoothly.
            </p>
            <p>
              When a customer completes a purchase, your dashboard updates immediately:
            </p>
            <ul>
              <li><strong>Instant Order Notification:</strong> Review the customer&apos;s name, phone number, shipping address, and selected product variants.</li>
              <li><strong>Order Status Updates:</strong> Change the order status from <em>Pending</em> to <em>Dispatched</em> or <em>Completed</em> as you fulfill the shipment.</li>
              <li><strong>Automatic Inventory Updates:</strong> Product stock quantities automatically decrease when an order is placed so you never oversell.</li>
            </ul>
          </section>

          {/* Section 5: Security & Trust */}
          <section id="data-protection" className="docs-article">
            <span className="docs-tag">SECURITY &amp; PRIVACY</span>
            <h1 className="docs-h1">100% Private Store Data</h1>
            <p className="docs-lead">
              Your business data, sales numbers, and customer information are strictly isolated and private.
            </p>
            <div className="docs-grid-cards">
              <div className="docs-card">
                <h3>Isolated Store Privacy</h3>
                <p>No other seller or store can ever view your sales figures, customer contact lists, or private store data.</p>
              </div>
              <div className="docs-card">
                <h3>Encrypted Accounts</h3>
                <p>All merchant passwords and account logins are secured with advanced encryption to protect your account against unauthorized access.</p>
              </div>
              <div className="docs-card">
                <h3>Safe &amp; Reliable Hosting</h3>
                <p>Continuous automatic data backups guarantee that your digital storefront stays online, fast, and accessible 24/7.</p>
              </div>
            </div>
          </section>

          <section id="secure-account" className="docs-article">
            <h2 className="docs-h2">Account &amp; Password Protection</h2>
            <p>
              Your store security is maintained automatically:
            </p>
            <ul>
              <li>Strong password protection prevents brute-force login attempts.</li>
              <li>Secure session tokens keep your dashboard active while you work and protect your account when you sign out.</li>
              <li>All customer orders and payment details are processed through encrypted, tamper-proof channels.</li>
            </ul>

            <div className="docs-callout docs-callout-info">
              <div className="docs-callout-icon">🔒</div>
              <div className="docs-callout-body">
                <strong>Sell With Peace of Mind:</strong> We handle store security and data protection in the background so you can focus 100% on serving your customers and growing your brand.
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}
