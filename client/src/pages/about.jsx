import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const About = () => {
  const aboutSections = [
    {
      title: 'What is Pneumonia?',
      icon: '🫁',
      content: 'Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm or pus, fever, chills, and difficulty breathing. It can range from mild ("walking pneumonia") to severe life-threatening illness.'
    },
    {
      title: 'Causes',
      icon: '🦠',
      content: 'Pneumonia can be caused by bacteria, viruses, or fungi. The most common cause is the bacterium Streptococcus pneumoniae. It spreads through respiratory droplets when an infected person coughs or sneezes.'
    },
    {
      title: 'Types',
      icon: '📋',
      content: 'There are several types: Bacterial pneumonia (most serious), Viral pneumonia (usually milder), Fungal pneumonia (rare, in immunocompromised), Aspiration pneumonia, and Walking pneumonia (mild mycoplasma infection).'
    }
  ];

  const symptoms = [
    { icon: '🤒', name: 'Fever', description: 'Usually 101°F (38.3°C) or higher' },
    { icon: '🤧', name: 'Cough', description: 'Persistent, may produce phlegm' },
    { icon: '😤', name: 'Shortness of Breath', description: 'Especially with physical activity' },
    { icon: '💔', name: 'Chest Pain', description: 'When breathing or coughing' },
    { icon: '😴', name: 'Fatigue', description: 'Severe tiredness and weakness' },
    { icon: '❄️', name: 'Chills', description: 'Often accompany fever' }
  ];

  const riskFactors = [
    { group: 'Age', items: ['Children under 5 years', 'Adults 65 years and older'] },
    { group: 'Medical Conditions', items: ['COPD', 'Asthma', 'Heart disease', 'Diabetes'] },
    { group: 'Lifestyle', items: ['Smoking', 'Alcohol abuse', 'Malnutrition'] }
  ];

  const recovery = [
    { icon: '💉', title: 'Medical Treatment', desc: 'Antibiotics for bacterial, antivirals for viral pneumonia' },
    { icon: '🏥', title: 'Oxygen Therapy', desc: 'Provided if oxygen levels are critically low' },
    { icon: '😴', title: 'Rest & Hydration', desc: 'Essential for immune system to fight infection' },
    { icon: '📈', title: 'Follow-up Care', desc: 'Monitoring ensures recovery and prevents relapse' }
  ];

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="hero-content">
          <h1>Understanding Pneumonia</h1>
          <p>Comprehensive information about pneumonia, its causes, symptoms, and treatment</p>
        </div>
      </div>

      <div className="about-container">
        {/* Overview Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>📚 What You Need to Know</h2>
            <p>Essential information about pneumonia</p>
          </div>

          <div className="about-grid">
            {aboutSections.map((section, index) => (
              <div key={index} className="about-card">
                <div className="card-icon">{section.icon}</div>
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="about-section">
          <div className="section-header">
            <h2>🩺 Common Symptoms</h2>
            <p>Recognize the signs of pneumonia early</p>
          </div>

          <div className="symptoms-grid">
            {symptoms.map((symptom, index) => (
              <div key={index} className="symptom-card">
                <div className="symptom-icon">{symptom.icon}</div>
                <h4>{symptom.name}</h4>
                <p>{symptom.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Factors */}
        <section className="about-section">
          <div className="section-header">
            <h2>⚠️ Risk Factors</h2>
            <p>Who is more likely to develop pneumonia</p>
          </div>

          <div className="risk-grid">
            {riskFactors.map((factor, index) => (
              <div key={index} className="risk-card">
                <h4>{factor.group}</h4>
                <ul>
                  {factor.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Treatment & Recovery */}
        <section className="about-section">
          <div className="section-header">
            <h2>💊 Treatment & Recovery</h2>
            <p>How pneumonia is treated and what to expect</p>
          </div>

          <div className="recovery-grid">
            {recovery.map((item, index) => (
              <div key={index} className="recovery-item">
                <div className="item-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Important Information */}
        <section className="important-info">
          <div className="info-card info-primary">
            <h3>📌 Key Points to Remember</h3>
            <ul>
              <li>Early detection significantly improves treatment outcomes</li>
              <li>Different types require different treatment approaches</li>
              <li>Follow medical advice and complete prescribed treatment</li>
              <li>Prevention through vaccination is highly effective</li>
              <li>Recovery requires rest, fluids, and close monitoring</li>
            </ul>
          </div>

          <div className="info-card info-warning">
            <h3>🚨 Seek Immediate Care If</h3>
            <ul>
              <li>You have severe difficulty breathing</li>
              <li>Your lips or fingernails turn blue</li>
              <li>You experience confusion or altered mental state</li>
              <li>You have severe chest pain</li>
              <li>Symptoms worsen after initial improvement</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div className="cta-box">
            <h2>Ready to Get Your X-Ray Analyzed?</h2>
            <p>Use our advanced AI technology to get instant chest X-ray analysis</p>
            <Link to="/predict" className="cta-button">
              Start Analysis Now →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
