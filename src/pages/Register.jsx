import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCircle2, 
  User, 
  Heart, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [activeTab, setActiveTab] = useState("intern");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [declaredTrue, setDeclaredTrue] = useState(false);
  
  // New Intern-specific fields
  const [formData, setFormData] = useState({
    age: "18 +",
    address: "",
    education: "Under Graduate",
    college: "",
    stream: "",
    status: "Study",
    whatsapp: "",
    phone: "",
    domain: "Community Service",
    duration: "1 Month",
    preference: "Independently",
    interestReason: "",
    previousExperience: "No",
    timing: "11:30 am to 4:30 pm, Theory Class (+ 10 Hours in a week Field Practical Extra)",
    startDate: "Today",
    otherStartDate: "",
    source: "Instagram",
    complianceAccepted: "No"
  });

  // New Volunteer(Happiness Spreader) fields
  const [volunteerFormData, setVolunteerFormData] = useState({
    age: "19 to 25 Years",
    address: "",
    aboutYourself: "Student",
    whatsapp: "",
    phone: "",
    expertise: "",
    interestReason: "",
    feasibleDay: "Monday",
    feasibleTiming: "11 am to 2 pm",
    startDate: "Today",
    otherStartDate: "",
    source: "Instagram",
    previousExperience: "",
    complianceAccepted: "No"
  });

  // Legacy fields for other roles
  const [companyName, setCompanyName] = useState("");
  const [interest, setInterest] = useState("");
  
  const navigate = useNavigate();

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'intern') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (activeTab === 'volunteer') {
      setVolunteerFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if ((activeTab === 'intern' || activeTab === 'volunteer') && step < 4) {
      setStep(prev => prev + 1);
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      let extraData = {};
      if (activeTab === 'intern') {
        extraData = { ...formData };
      } else if (activeTab === 'volunteer') {
        extraData = { ...volunteerFormData };
      }
      
      if (activeTab === 'sponsor') extraData.companyName = companyName;
      if (activeTab === 'donor') extraData.phone = formData.phone;
      if (activeTab === 'donor') extraData.interest = interest;

      if (!declaredTrue) {
        setError("You must declare that the information provided is true.");
        setLoading(false);
        return;
      }

      // Generate pseudo-email based on the phone/whatsapp number to support auth flows
      const phoneVal = extraData.whatsapp || extraData.phone || formData.phone || "user_" + Date.now();
      const generatedEmail = `${phoneVal.toString().replace(/\D/g, '')}@teamckb.com`;

      const registrationData = {
        name,
        email: generatedEmail, // Use the generated email
        role: activeTab,
        status: "pending",
        createdAt: serverTimestamp(),
        ...extraData
      };

      await addDoc(collection(db, "pending_registrations"), registrationData);
      setShowSuccess(true);
    } catch (err) {
      setError("Failed to submit registration. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'intern', label: 'Intern', icon: UserCircle2, desc: 'Gain experience and log daily tasks.' },
    { id: 'volunteer', label: 'Volunteer(Happiness Spreader)', icon: User, desc: 'Contribute your time to social causes.' },
    { id: 'donor', label: 'Donor', icon: Heart, desc: 'Support our mission financially.' },
    { id: 'sponsor', label: 'Sponsor', icon: Building2, desc: 'Partner with us as an organization.' },
  ];

  const renderStep = () => {
    const currentData = activeTab === 'intern' ? formData : volunteerFormData;

    switch(step) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Name *</label>
                <input type="text" className="glass-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name per ID" />
              </div>
              <div className="mobile-full">
                <label className="form-label">Age *</label>
                {activeTab === 'intern' ? (
                  <select name="age" className="glass-input" value={currentData.age} onChange={handleFormDataChange}>
                    <option value="Under 18">Under 18</option>
                    <option value="18 +">18 +</option>
                  </select>
                ) : (
                  <select name="age" className="glass-input" value={currentData.age} onChange={handleFormDataChange}>
                    <option value="16 to 18 Years">16 to 18 Years</option>
                    <option value="19 to 25 Years">19 to 25 Years</option>
                    <option value="26 to 35 Years">26 to 35 Years</option>
                    <option value="36 to 50 Years">36 to 50 Years</option>
                    <option value="51 + Years">51 + Years</option>
                  </select>
                )}
              </div>
              <div className="mobile-full">
                <label className="form-label">WhatsApp Number *</label>
                <input type="tel" name="whatsapp" className="glass-input" required value={currentData.whatsapp} onChange={handleFormDataChange} placeholder="WhatsApp No." />
              </div>
              <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Complete Address with pin code *</label>
                <textarea name="address" className="glass-input" required value={currentData.address} onChange={handleFormDataChange} placeholder="Your full address..." rows="2" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {activeTab === 'intern' ? (
                <>
                  <div className="mobile-full">
                    <label className="form-label">Education *</label>
                    <select name="education" className="glass-input" value={currentData.education} onChange={handleFormDataChange}>
                      <option value="Under Graduate">Under Graduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div className="mobile-full">
                    <label className="form-label">Stream *</label>
                    <input type="text" name="stream" className="glass-input" required value={currentData.stream} onChange={handleFormDataChange} placeholder="e.g. B.Com, Engineering" />
                  </div>
                  <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">College Name With Full Address *</label>
                    <input type="text" name="college" className="glass-input" required value={currentData.college} onChange={handleFormDataChange} placeholder="College Name & Location" />
                  </div>
                  <div className="mobile-full">
                    <label className="form-label">Current Status *</label>
                    <select name="status" className="glass-input" value={currentData.status} onChange={handleFormDataChange}>
                      <option value="Study">Study</option>
                      <option value="Job">Job</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mobile-full">
                    <label className="form-label">About Yourself *</label>
                    <select name="aboutYourself" className="glass-input" value={currentData.aboutYourself} onChange={handleFormDataChange}>
                      <option value="Student">Student</option>
                      <option value="Pvt. Job">Pvt. Job</option>
                      <option value="Govt. Job">Govt. Job</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Explain About Yourself (Expertise) *</label>
                    <textarea name="expertise" className="glass-input" required value={currentData.expertise} onChange={handleFormDataChange} placeholder="Tell us about your experience and skills..." rows="3" />
                  </div>
                </>
              )}
              <div className="mobile-full">
                <label className="form-label">Calling Number *</label>
                <input type="tel" name="phone" className="glass-input" required value={currentData.phone} onChange={handleFormDataChange} placeholder="Primary Phone" />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {activeTab === 'intern' ? (
                <>
                  <div className="mobile-full">
                    <label className="form-label">Internship Domain *</label>
                    <select name="domain" className="glass-input" value={currentData.domain} onChange={handleFormDataChange}>
                      <option value="Community Service">Community Service</option>
                      <option value="Leftover Management">Leftover Management</option>
                      <option value="Event Management">Event Management</option>
                    </select>
                  </div>
                  <div className="mobile-full">
                    <label className="form-label">Duration *</label>
                    <select name="duration" className="glass-input" value={currentData.duration} onChange={handleFormDataChange}>
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Internship Mode *</label>
                    <select name="preference" className="glass-input" value={currentData.preference} onChange={handleFormDataChange}>
                      <option value="Independently">Independently</option>
                      <option value="College">Through College</option>
                    </select>
                  </div>
                  <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Available Timing *</label>
                    <select name="timing" className="glass-input" value={currentData.timing} onChange={handleFormDataChange}>
                      <option value="11:30 am to 4:30 pm, Theory Class (+ 10 Hours in a week Field Practical Extra)">11:30 am to 4:30 pm (+ Field Work)</option>
                      <option value="2 pm to 7 pm, Theory Class (+ 10 Hours in a week Field Practical Extra)">2 pm to 7 pm (+ Field Work)</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mobile-full">
                    <label className="form-label">Your feasible day *</label>
                    <select name="feasibleDay" className="glass-input" value={currentData.feasibleDay} onChange={handleFormDataChange}>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  <div className="mobile-full">
                    <label className="form-label">Your feasible timing *</label>
                    <select name="feasibleTiming" className="glass-input" value={currentData.feasibleTiming} onChange={handleFormDataChange}>
                      <option value="5 am to 8 am">5 am to 8 am</option>
                      <option value="11 am to 2 pm">11 am to 2 pm</option>
                      <option value="3 pm to 7 pm">3 pm to 7 pm</option>
                      <option value="7 pm to 10 pm">7 pm to 10 pm</option>
                      <option value="9 pm to 1 am">9 pm to 1 am</option>
                    </select>
                  </div>
                </>
              )}
              <div className="mobile-full" style={{ gridColumn: activeTab === 'volunteer' ? 'span 2' : 'auto' }}>
                <label className="form-label">Starting From *</label>
                <select name="startDate" className="glass-input" value={currentData.startDate} onChange={handleFormDataChange}>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Next Monday">Next Monday</option>
                  <option value="Other">Other (Specify Date)</option>
                </select>
              </div>
              {currentData.startDate === 'Other' && (
                <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Specify Date *</label>
                  <input type="text" name="otherStartDate" className="glass-input" required value={currentData.otherStartDate} onChange={handleFormDataChange} placeholder="Day, Month, Year" />
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="form-label">Why are you interested in interning with our organization specifically? *</label>
              <textarea name="interestReason" className="glass-input" required value={currentData.interestReason} onChange={handleFormDataChange} rows="3" placeholder="Tell us your motivation..." />
            </div>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="mobile-full">
                <label className="form-label">{activeTab === 'intern' ? 'Previous Volunteering Experience?' : 'Have you volunteered or worked for a social cause previously? *'}</label>
                {activeTab === 'intern' ? (
                  <select name="previousExperience" className="glass-input" value={currentData.previousExperience} onChange={handleFormDataChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                ) : (
                  <textarea name="previousExperience" className="glass-input" required value={currentData.previousExperience} onChange={handleFormDataChange} rows="2" placeholder="Where and how was your experience..." />
                )}
              </div>
              <div className="mobile-full">
                <label className="form-label">Where did you find out about us? *</label>
                <select name="source" className="glass-input" value={currentData.source} onChange={handleFormDataChange}>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Friends">Friends</option>
                  <option value="W.O.M.">W.O.M.</option>
                  <option value="News Paper">News Paper</option>
                </select>
              </div>
            </div>
            
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(212, 163, 115, 0.05)', border: '1px solid rgba(212, 163, 115, 0.1)', fontSize: '0.85rem' }}>
              <p style={{ margin: 0, opacity: 0.8 }}>
                <strong>Note:</strong> There should be no fees for anyone. (T-shirt, Id Card And Badges are FREE). Aadhaar Card's xerox and 2 Passport size Photos are required at office. 
                <br /><br />
                Your response will be shared via WhatsApp with a token number during working hours.
              </p>
            </div>

            <div>
              <label className="form-label">Save +917775964171 for future updates? *</label>
              <select name="complianceAccepted" className="glass-input" value={currentData.complianceAccepted} onChange={handleFormDataChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="truthDeclaration" 
                required
                checked={declaredTrue}
                onChange={e => setDeclaredTrue(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#d4a373' }}
              />
              <label htmlFor="truthDeclaration" style={{ fontSize: '0.9rem', opacity: 0.8, cursor: 'pointer' }}>
                I declare that the information provided by me is true. *
              </label>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '80vh' }}>
      <style>{`
        .form-label { display: block; marginBottom: 8px; fontSize: 0.8rem; opacity: 0.5; fontWeight: 600; textTransform: uppercase; }
        .step-indicator { width: 8px; height: 8px; borderRadius: 50%; background: rgba(255,255,255,0.1); }
        .step-indicator.active { background: var(--wood-accent); boxShadow: 0 0 10px var(--wood-accent); }
      `}</style>
      <motion.div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '900px', padding: 0, overflow: 'hidden' }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            <div style={{ background: 'rgba(212, 163, 115, 0.05)', padding: '40px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <Link to="/" style={{ color: 'var(--wood-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> <span className="desktop-only">Back to Home</span>
              </Link>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Join Us</h2>
              <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '32px' }}>
                Become a part of the TeamCKB family. Select your path and start making an impact today.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {tabs.map(tab => (
                  <div 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setStep(1); }}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '14px',
                      background: activeTab === tab.id ? 'rgba(212, 163, 115, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${activeTab === tab.id ? 'rgba(212, 163, 115, 0.4)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <tab.icon size={18} color={activeTab === tab.id ? '#d4a373' : 'rgba(255,255,255,0.5)'} />
                    <span style={{ fontWeight: activeTab === tab.id ? '600' : '400', fontSize: '0.95rem', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>{tab.label}</span>
                  </div>
                ))}
              </div>

              {(activeTab === 'intern' || activeTab === 'volunteer') && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`step-indicator ${step === s ? 'active' : ''}`} />
                  ))}
                  <span style={{ fontSize: '0.75rem', opacity: 0.5, marginLeft: '8px' }}>Step {step} of 4</span>
                </div>
              )}
            </div>

            <div style={{ padding: '40px' }}>
              {error && <div style={{ background: 'rgba(255,70,70,0.1)', color: '#ff8080', padding: '14px', borderRadius: '10px', marginBottom: '24px', border: '1px solid rgba(255,70,70,0.2)', fontSize: '0.85rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeTab}-${step}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(activeTab === 'intern' || activeTab === 'volunteer') ? renderStep() : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Full Name *</label>
                            <input type="text" className="glass-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
                          </div>
                        </div>

                        {activeTab === 'sponsor' && (
                          <div>
                            <label className="form-label">Organization Name *</label>
                            <input type="text" className="glass-input" required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company Name" />
                          </div>
                        )}

                        {activeTab === 'donor' && (
                          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                            <div className="mobile-full">
                              <label className="form-label">Interest Area</label>
                              <select className="glass-input" value={interest} onChange={e => setInterest(e.target.value)}>
                                <option value="Education">Education Support</option>
                                <option value="Health">Health & Hygiene</option>
                                <option value="Food">Food Security</option>
                                <option value="All">All Impact Areas</option>
                              </select>
                            </div>
                            <div className="mobile-full">
                              <label className="form-label">Phone *</label>
                              <input type="tel" className="glass-input" required value={formData.phone} onChange={handleFormDataChange} placeholder="+91..." />
                            </div>
                          </div>
                        )}

                        {activeTab === 'volunteer' && (
                          <div>
                            <label className="form-label">Main Area of Interest *</label>
                            <input type="text" className="glass-input" required value={interest} onChange={e => setInterest(e.target.value)} placeholder="e.g. Field Work, Teaching" />
                          </div>
                        )}

                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="checkbox" 
                            id="truthDeclarationOther" 
                            required
                            checked={declaredTrue}
                            onChange={e => setDeclaredTrue(e.target.checked)}
                            style={{ width: '20px', height: '20px', accentColor: '#d4a373' }}
                          />
                          <label htmlFor="truthDeclarationOther" style={{ fontSize: '0.9rem', opacity: 0.8, cursor: 'pointer' }}>
                            I declare that the information provided by me is true. *
                          </label>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                  {(activeTab === 'intern' || activeTab === 'volunteer') && step > 1 && (
                    <button type="button" onClick={() => setStep(step - 1)} className="glass-button" style={{ flex: 1 }}>Back</button>
                  )}
                  <button disabled={loading} type="submit" className="glass-button primary" style={{ flex: 2, height: '54px' }}>
                    {loading ? "Processing..." : ((activeTab === 'intern' || activeTab === 'volunteer') && step < 4 ? 'Next Step' : `Join as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`)}
                    {(!loading && ((activeTab !== 'intern' && activeTab !== 'volunteer') || step < 4)) && <ArrowRight size={18} style={{ marginLeft: '10px' }} />}
                  </button>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.6, fontSize: '0.9rem' }}>
                Already a member? <Link to="/login" style={{ color: 'var(--wood-accent)', fontWeight: 'bold', textDecoration: 'none', marginLeft: '4px' }}>Log In</Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>


      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(18, 9, 7, 0.8)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass-panel"
              style={{
                maxWidth: '500px',
                width: '100%',
                padding: '40px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(212, 163, 115, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle2 size={40} color="#d4a373" />
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Registration Successful!</h2>
              <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '32px' }}>
                Your account for <strong>{name}</strong> has been created. <br /><br />
                <span style={{ color: 'var(--wood-accent)', fontWeight: '600' }}>Waiting for Admin Approval.</span><br />
                You will be able to log in once an administrator verifies your application.
              </p>
              <button 
                onClick={() => navigate("/login")}
                className="glass-button primary"
                style={{ width: '100%', height: '54px' }}
              >
                Back to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
