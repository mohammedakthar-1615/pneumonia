import { Link } from 'react-router-dom';
import lungRecovery from '../assets/lung-recovery.svg';

const About = () => {
  return (
    <main className="page about-page">
      <section className="hero-panel card">
        <div>
          <p className="hero-eyebrow">About Pneumonia</p>
          <h1 className="hero-title">Understand the disease, treatment, and recovery path</h1>
          <p className="hero-copy">
            Pneumonia is an infection that inflames one or both lungs, filling air sacs with fluid or pus and making breathing difficult.
            PneumoSense is designed to support clinical workflows with AI-powered X-ray analysis, helping providers identify disease early and manage recovery effectively.
          </p>
        </div>
        <div style={{ display: 'grid', gap: '18px' }}>
          <div className="news-card">
            <p className="news-card-title">Why this matters</p>
            <p className="news-card-text">Early detection and follow-up imaging help reduce hospital stays, speed recovery, and prevent complications from untreated lung infections.</p>
          </div>
          <div className="news-card">
            <p className="news-card-title">How AI can help</p>
            <p className="news-card-text">The platform highlights abnormal patterns in chest X-rays, making it easier for clinicians to prioritize patients who need urgent care or closer monitoring.</p>
          </div>
        </div>
      </section>

      <section className="card about-grid">
        <div>
          <h2 className="section-title">What pneumonia means for patients</h2>
          <p className="section-description">
            Pneumonia symptoms range from mild discomfort to severe respiratory distress. Common indicators include cough, fever, shortness of breath, chest pain, and fatigue.
            Patients with chronic conditions, age-related vulnerability, or weakened immunity should receive especially careful monitoring.
          </p>
          <ul className="guidelines-list">
            <li>Chest infection can be caused by bacteria, viruses, or fungi.</li>
            <li>Viral pneumonia is common in respiratory illnesses, while bacterial pneumonia may need antibiotics.</li>
            <li>Follow-up imaging supports care plans and helps confirm improvement or the need for additional treatment.</li>
          </ul>
        </div>
        <div className="about-visual card">
          <div className="visual-label">Healthy vs affected lungs</div>
          <div className="visual-card-image">
            <img src={lungRecovery} alt="Lung recovery illustration" className="page-illustration" />
          </div>
          <p className="news-card-text" style={{ marginTop: '20px' }}>
            Imaging focus is one part of patient care. Use clinical findings, symptoms, and AI-assisted chest X-ray interpretation together for the best outcome.
          </p>
        </div>
      </section>

      <section className="card">
        <h2 className="section-title">Recovery guidance</h2>
        <p className="section-description">
          Recovery from pneumonia is strengthened by consistent follow-up, supportive care, and good respiratory hygiene. The AI reports are intended to complement physician-led treatment plans.
        </p>
        <div className="dashboard-grid">
          <div className="news-card">
            <p className="news-card-title">Supportive care</p>
            <p className="news-card-text">Rest, hydration, and avoiding smoke or pollutants are foundational to recovery.</p>
          </div>
          <div className="news-card">
            <p className="news-card-title">Medication adherence</p>
            <p className="news-card-text">Complete antibiotic or antiviral regimens as prescribed, even when symptoms begin to improve.</p>
          </div>
          <div className="news-card">
            <p className="news-card-title">Follow-up checks</p>
            <p className="news-card-text">Repeat imaging and symptom monitoring help verify recovery and support care decisions.</p>
          </div>
        </div>
        <div style={{ marginTop: '22px' }}>
          <Link to="/predict" className="glow-btn">Run a new patient scan</Link>
        </div>
      </section>
    </main>
  );
};

export default About;
