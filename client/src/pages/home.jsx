import { Link } from 'react-router-dom';
import pneumoniaVisual from '../assets/pneumonia-visual.svg';

const Home = () => {
  return (
    <main className="page home-page">
      <section className="hero-panel card hero-with-image">
        <div>
          <p className="hero-eyebrow">AI powered X-ray screening</p>
          <h1 className="hero-title">Futuristic Pneumonia Intelligence for clinical workflows</h1>
          <p className="hero-copy">
            PneumoSense brings AI-driven pneumonia prediction, patient history tracking, and recovery monitoring into a single dashboard.
            Use secure X-ray uploads, generate instant risk reports, and track progress with precision metrics.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
            <span className="glow-btn">Realtime insights</span>
            <span className="ghost-btn">History-aware tracking</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: '18px' }}>
          <div className="news-card">
            <p className="news-card-title">Why early pneumonia detection matters</p>
            <p className="news-card-text">Timely diagnosis reduces complications, speeds recovery, and empowers clinicians with confidence scores from each scan.</p>
          </div>
          <div className="news-card">
            <p className="news-card-title">Smart patient journeys</p>
            <p className="news-card-text">Each upload becomes a new entry in a patient’s longitudinal history, making recovery trends easy to review.</p>
          </div>
        </div>
        <div className="page-image-wrapper">
          <img src={pneumoniaVisual} alt="AI pneumonia X-ray visualization" className="page-illustration" />
        </div>
      </section>

      <section className="card about-grid">
        <div className="info-panel">
          <h2 className="section-title">Pneumonia in a clinical context</h2>
          <p className="section-description">
            Pneumonia is an infection that inflames the air sacs in one or both lungs. In hospital settings, early detection is essential for reducing the risk of respiratory distress, complications, and extended hospital stays.
          </p>
          <ul className="guidelines-list">
            <li>Common symptoms include cough, fever, chest pain, and breathing difficulty.</li>
            <li>High-risk patients include older adults, young children, and people with weakened immune systems.</li>
            <li>Follow-up imaging helps clinicians confirm response to treatment and recovery progress.</li>
          </ul>
          <div style={{ marginTop: '20px' }}>
            <Link to="/about" className="glow-btn">Learn more about pneumonia</Link>
          </div>
        </div>
        <div className="about-visual card">
          <div className="visual-label">Chest X-ray view</div>
          <div className="visual-grid">
            <span className="visual-dot"></span>
            <span className="visual-line"></span>
            <span className="visual-dot"></span>
            <span className="visual-line"></span>
            <span className="visual-shade"></span>
          </div>
          <p className="news-card-text" style={{ marginTop: '24px' }}>
            AI-assisted screening supports radiology workflows by highlighting abnormal lung opacities and prioritizing patients who need urgent care.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
