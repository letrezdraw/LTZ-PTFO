import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  {
    name: 'TIER_01',
    title: 'CHARACTER ILLUSTRATION',
    items: [
      { label: 'Headshot', price: '$70 / ₹6,680' },
      { label: 'Half Body', price: '$105 / ₹10,019' },
      { label: 'Full Body', price: '$150 / ₹14,314' }
    ]
  },
  {
    name: 'TIER_02',
    title: 'CHARACTER DESIGN (Pro)',
    price: '$380 / ₹36,263',
    features: ['Full Character Sheet', 'Front + Back View', '3 Facial Expressions']
  },
  {
    name: 'TIER_03',
    title: 'BOOK COVERS & SPLASH ART',
    items: [
      { label: 'Standard Cover', price: '$270 / ₹25,766' },
      { label: 'Full Wrap Cover', price: '$490 / ₹46,761' },
      { label: 'Splash / Wallpaper', price: '$325 / ₹26,975' }
    ]
  },
  {
    name: 'TIER_04',
    title: 'VECTOR & LINE ART',
    items: [
      { label: 'Complex Vector', price: '$80 / ₹7,634' },
      { label: 'Illustration (Flat)', price: '$120 / ₹11,452' }
    ]
  }
];

const policies = [
  {
    title: '01 COMMERCIAL USE POLICY',
    content: 'Prices listed in Tiers 01, 02, and 04 are for Personal Use only. For commercial rights buyouts (merchandise, streaming assets, promotion), a standard x2 base multiplier applies. Tier 03 (Book Covers) includes standard indie publishing rights unless otherwise negotiated.'
  },
  {
    title: '02 REVISION LIMITS',
    content: 'Includes 2 free major revision rounds during the initial sketching stage. Minor adjustments can be made during flat coloring. Major composition changes requested after line art or final rendering will incur an additional fee.'
  },
  {
    title: '03 PAYMENT TERMS',
    content: 'A 50% non-refundable upfront deposit is required before booking slot and work begins. The remaining 50% balance is due upon final approval of the watermarked preview, prior to high-resolution file delivery.'
  },
  {
    title: '04 CLEAR DEADLINES & RUSH FEES',
    content: 'Standard turnaround time is 3–5 weeks depending on complexity and queue placement. Urgent orders required in under 14 days will incur a 50% rush fee surcharge.'
  },
  {
    title: '05 BOOKING CALL-TO-ACTION',
    content: 'To claim a slot, email letrezdraw@gmail.com or fill out the booking form with your project details, visual references, and deadline.'
  }
];

export const ClearanceHub = () => {
  const rootRef = useRef(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'CHARACTER_ILLUSTRATION',
    message: '',
    uploadedFiles: []
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const ctx = gsap.context(() => {
      root.querySelectorAll('.hub-reveal').forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          delay: i * 0.04
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Transmission queued (connect to Formspree / backend when ready).');
    setFormData({
      name: '',
      email: '',
      projectType: 'CHARACTER_ILLUSTRATION',
      message: '',
      uploadedFiles: []
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: (file.size / 1024).toFixed(2), // KB
      type: file.type
    }));
    setFormData({
      ...formData,
      uploadedFiles: [...formData.uploadedFiles, ...newFiles]
    });
  };

  const removeFile = (index) => {
    const updatedFiles = formData.uploadedFiles.filter((_, i) => i !== index);
    updatedFiles.forEach(() => {
      if (formData.uploadedFiles[index].preview) {
        URL.revokeObjectURL(formData.uploadedFiles[index].preview);
      }
    });
    setFormData({
      ...formData,
      uploadedFiles: updatedFiles
    });
  };

  return (
    <section
      id="clearance"
      ref={rootRef}
      className="clearance-hub"
      style={{
        position: 'relative',
        zIndex: 100,
        padding: '72px 48px 96px',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 52%, var(--bg-primary) 100%)',
        borderTop: '1px solid var(--border-color)'
      }}
    >
      <div className="hub-inner">
      <div
        className="section-stamp hub-reveal"
        style={{
          fontSize: '22px',
          color: 'var(--text-primary)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '40px',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        // <span style={{ color: 'var(--accent-red)' }}>CLEARANCE</span> ·{' '}
        <span style={{ color: 'var(--text-secondary)' }}>TRANSMISSION</span> ◈ SINGLE_SECURE_NODE ◈{' '}
        <span style={{ color: 'var(--accent-red)' }}>OPEN</span>
      </div>

      <div
        className="hub-reveal hub-dual-banner"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2px',
          marginBottom: '40px',
          maxWidth: '1100px',
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0,
          transform: 'translateY(16px)'
        }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--accent-red)',
              boxShadow: '0 0 12px var(--accent-red)',
              animation: 'pulse-blink 1.2s infinite'
            }}
          />
          <div>
            <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '2px' }}>CLEARANCE_DESK</div>
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px' }}>Commissions · remote worldwide</div>
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '20px 24px'
          }}
        >
          <div style={{ fontSize: '22px', color: 'var(--text-secondary)', letterSpacing: '2px' }}>TRANSMISSION_LINE</div>
          <div style={{ fontSize: '15px', color: 'var(--text-primary)', marginTop: '4px' }}>Encrypted inquiry · response within 48h</div>
        </div>
      </div>

      <div className="hub-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="hub-reveal hub-tier-wrap"
              style={{
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              <div className="hub-tier-card">
              <div className="corner-bracket corner-tl" style={{ top: 6, left: 6 }} />
              <div className="corner-bracket corner-br" style={{ bottom: 6, right: 6 }} />
              <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '6px' }}>{tier.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                <h3 style={{ fontSize: '17px', fontFamily: "'Cinzel', serif", color: 'var(--text-primary)', margin: 0 }}>{tier.title}</h3>
                {tier.price && <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent-red)', fontFamily: "'Cinzel', serif" }}>{tier.price}</span>}
              </div>
              {tier.items ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', fontSize: '22px', color: 'var(--text-secondary)', lineHeight: '1.85' }}>
                  {tier.items.map((item) => (
                    <li key={item.label}>
                      <span style={{ color: 'var(--accent-red)' }}>▸</span> {item.label}: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.price}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', fontSize: '22px', color: 'var(--text-secondary)', lineHeight: '1.85' }}>
                  {tier.features.map((f) => (
                    <li key={f}>
                      <span style={{ color: 'var(--accent-red)' }}>▸</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              </div>
            </div>
          ))}
        </div>

        <div
          className="hub-reveal hub-transmit-wrap"
          style={{
            opacity: 0,
            transform: 'translateY(20px)'
          }}
        >
          <div className="hub-transmit-panel">
          <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '3px', marginBottom: '16px' }}>// SECURE_UPLINK</div>
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.9', marginBottom: '24px', fontFamily: "'Share Tech Mono', monospace" }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '12px' }}>// PROCESS</div>
            <div style={{ marginBottom: '6px' }}>&gt; DM with idea + reference images</div>
            <div style={{ marginBottom: '6px' }}>&gt; 50% deposit to start work</div>
            <div style={{ marginBottom: '6px' }}>&gt; Sketch approval + 2 major revisions</div>
            <div style={{ marginBottom: '12px' }}>&gt; Final payment · HD files delivery</div>
            
            <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '12px' }}>// ADDONS</div>
            <div style={{ marginBottom: '6px' }}>&gt; Complex Background: $24-60 / ₹2,290-5,726</div>
            <div style={{ marginBottom: '6px' }}>&gt; Extra Character: +75% of base price</div>
            <div style={{ marginBottom: '12px' }}>&gt; Commercial Rights (x2):</div>
            <div style={{ marginBottom: '12px' }}>&gt; Turnaround: 1-3 weeks</div>
            
            <div style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '6px' }}>// PAYMENT</div>
            <div>&gt; 50% via UPI / GPay / PayPal · 1-3 weeks turnaround</div>
          </div>

          <form onSubmit={handleSubmit} className="hub-form">
            <input
              type="text"
              placeholder="// NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="hub-input"
            />
            <input
              type="email"
              placeholder="// EMAIL"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="hub-input"
            />
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              className="hub-input"
            >
              <option value="CHARACTER_ILLUSTRATION">CHARACTER_ILLUSTRATION</option>
              <option value="CHARACTER_DESIGN">CHARACTER_DESIGN</option>
              <option value="BOOK_COVERS_SPLASH">BOOK_COVERS_SPLASH</option>
              <option value="VECTOR_LINE_ART">VECTOR_LINE_ART</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
            <textarea
              placeholder="// PROJECT BRIEF"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
              className="hub-input hub-textarea"
            />

            {/* File Upload Section */}
            <div style={{
              marginTop: '16px',
              padding: '16px',
              border: '1px dashed var(--border-color)',
              backgroundColor: 'rgba(212, 0, 0, 0.02)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
              position: 'relative'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'var(--accent-red)';
              e.currentTarget.style.backgroundColor = 'rgba(212, 0, 0, 0.08)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'rgba(212, 0, 0, 0.02)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.backgroundColor = 'rgba(212, 0, 0, 0.02)';
              handleFileUpload({ target: { files: e.dataTransfer.files } });
            }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,image/*,video/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-red)',
                  cursor: 'pointer',
                  fontSize: '15px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: "'Share Tech Mono', monospace",
                  width: '100%',
                  padding: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = '0 0 8px var(--accent-red)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                ◆ ATTACH_REFERENCE_FILES ◆ (Drag & Drop or Click)
              </button>
              <div style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '1px' }}>
                Images, PDFs, Documents up to ~25MB total
              </div>
            </div>

            {/* Uploaded Files Display */}
            {formData.uploadedFiles.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '22px', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
                  📎 ATTACHED_FILES ({formData.uploadedFiles.length})
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  {formData.uploadedFiles.map((fileItem, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        background: fileItem.preview ? `url(${fileItem.preview})` : 'var(--bg-card)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--border-color)',
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '7px',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent-red)';
                        e.currentTarget.style.boxShadow = '0 0 8px rgba(212, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {fileItem.preview && <img src={fileItem.preview} alt={fileItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      {!fileItem.preview && (
                        <div style={{ textAlign: 'center', padding: '4px' }}>
                          <div style={{ fontSize: '22px', marginBottom: '4px' }}>📄</div>
                          <div style={{ wordBreak: 'break-word' }}>{fileItem.name.substring(0, 12)}</div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'var(--accent-red)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          fontSize: '22px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          opacity: 0,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)', letterSpacing: '1px' }}>
                  {formData.uploadedFiles.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(2)} KB total
                </div>
              </div>
            )}

            <button type="submit" className="button-red" style={{ width: '100%', padding: '14px', fontSize: '15px', letterSpacing: '2px', marginTop: '16px' }}>
              [ TRANSMIT CLEARANCE REQUEST ]
            </button>
          </form>
          </div>
        </div>
      </div>

      <div
        className="hub-reveal"
        style={{
          marginTop: '48px',
          paddingTop: '28px',
          borderTop: '1px solid var(--border-color)',
          opacity: 0,
          transform: 'translateY(12px)'
        }}
      >
        <div style={{ fontSize: '15px', color: 'var(--accent-red)', letterSpacing: '2px', marginBottom: '24px', textTransform: 'uppercase' }}>
          // TERMS_OF_SERVICE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {policies.map((policy, idx) => (
            <div key={idx} style={{ borderLeft: '2px solid var(--accent-red)', paddingLeft: '16px' }}>
              <div style={{ fontSize: '15px', color: 'var(--accent-red)', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 'bold' }}>
                {policy.title}
              </div>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {policy.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="hub-reveal"
        style={{
          marginTop: '24px',
          paddingTop: '28px',
          borderTop: '1px solid var(--border-color)',
          fontSize: '22px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          letterSpacing: '1px',
          opacity: 0,
          transform: 'translateY(12px)'
        }}
      >
        © 2026 LETREZDRAW · HUMAN_MADE · NO_AI
      </div>
      </div>
    </section>
  );
};
