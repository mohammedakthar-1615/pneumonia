import React from 'react';
import './styles/Precautions.css';

const Precautions = () => {
  const precautions = [
    {
      title: 'Vaccination',
      icon: '💉',
      items: [
        'Get annual flu shots to prevent influenza',
        'Receive pneumococcal vaccines as recommended',
        'Keep vaccinations up to date for children and elderly',
        'Consult healthcare providers about vaccine options'
      ]
    },
    {
      title: 'Personal Hygiene',
      icon: '🧼',
      items: [
        'Wash hands regularly with soap and water for 20 seconds',
        'Avoid touching face, especially eyes and nose',
        'Cover mouth and nose when coughing or sneezing',
        'Use hand sanitizer when soap is not available',
        'Maintain good oral hygiene to prevent infections'
      ]
    },
    {
      title: 'Lifestyle Habits',
      icon: '🏃',
      items: [
        'Exercise regularly to strengthen immune system',
        'Get adequate sleep (7-9 hours per night)',
        'Manage stress through meditation and relaxation',
        'Maintain a balanced, nutritious diet',
        'Stay hydrated by drinking plenty of water'
      ]
    },
    {
      title: 'Avoid Risk Factors',
      icon: '⛔',
      items: [
        'Quit smoking and avoid secondhand smoke',
        'Limit alcohol consumption',
        'Avoid prolonged exposure to air pollutants',
        'Practice respiratory etiquette in public places',
        'Keep distance from people with respiratory infections'
      ]
    },
    {
      title: 'Environmental Control',
      icon: '🏠',
      items: [
        'Maintain good indoor air quality',
        'Keep living spaces clean and well-ventilated',
        'Reduce humidity to prevent mold growth',
        'Use humidifiers in dry environments',
        'Clean air filters in HVAC systems regularly'
      ]
    },
    {
      title: 'Medical Monitoring',
      icon: '🩺',
      items: [
        'Schedule regular health check-ups',
        'Monitor for respiratory symptoms',
        'Keep medical records organized and updated',
        'Report unusual symptoms to healthcare provider',
        'Maintain medication adherence if prescribed'
      ]
    }
  ];

  const symptoms = [
    {
      title: 'Early Warning Signs',
      icon: '🚨',
      description: 'Seek medical attention if you experience:',
      items: [
        'Persistent cough lasting more than a week',
        'Chest pain when breathing or coughing',
        'Shortness of breath at rest',
        'Fever over 101°F (38.3°C)',
        'Severe fatigue or weakness'
      ],
      color: 'warning'
    },
    {
      title: 'Emergency Symptoms',
      icon: '🚑',
      description: 'Seek immediate medical help if you have:',
      items: [
        'Severe difficulty breathing',
        'Bluish lips or fingernails',
        'Confusion or altered mental state',
        'Severe chest pain',
        'Loss of consciousness'
      ],
      color: 'danger'
    }
  ];

  const recovery = [
    {
      title: 'During Treatment',
      icon: '💊',
      tips: [
        'Take prescribed medications as directed',
        'Get plenty of rest to aid recovery',
        'Drink plenty of fluids to stay hydrated',
        'Use a humidifier to ease breathing',
        'Eat nutritious, easy-to-digest foods',
        'Avoid smoke, dust, and air pollution'
      ]
    },
    {
      title: 'After Recovery',
      icon: '✅',
      tips: [
        'Complete full course of prescribed treatment',
        'Schedule follow-up appointments with doctor',
        'Gradually return to normal activities',
        'Monitor for any recurring symptoms',
        'Maintain healthy lifestyle habits',
        'Build up stamina with gentle exercise'
      ]
    },
    {
      title: 'Long-term Care',
      icon: '❤️',
      tips: [
        'Continue regular medical check-ups',
        'Maintain vaccination schedules',
        'Practice respiratory hygiene daily',
        'Manage underlying health conditions',
        'Reduce exposure to risk factors',
        'Report any health changes to healthcare provider'
      ]
    }
  ];

  return (
    <div className="precautions-page">
      <div className="precautions-hero">
        <div className="hero-content">
          <h1>Pneumonia Prevention & Care Guide</h1>
          <p>Your comprehensive guide to preventing pneumonia and ensuring a healthy recovery</p>
        </div>
      </div>

      <div className="precautions-container">
        {/* Prevention Section */}
        <section className="precautions-section">
          <div className="section-header">
            <h2>🛡️ Prevention Measures</h2>
            <p>Reduce your risk of developing pneumonia</p>
          </div>

          <div className="precautions-grid">
            {precautions.map((item, index) => (
              <div key={index} className="precaution-card">
                <div className="card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <ul className="precaution-items">
                  {item.items.map((precaution, idx) => (
                    <li key={idx}>
                      <span className="check-mark">✓</span>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Symptoms Section */}
        <section className="precautions-section">
          <div className="section-header">
            <h2>⚠️ Recognize the Symptoms</h2>
            <p>Know when to seek medical attention</p>
          </div>

          <div className="symptoms-grid">
            {symptoms.map((symptom, index) => (
              <div key={index} className={`symptom-card symptom-${symptom.color}`}>
                <div className="symptom-icon">{symptom.icon}</div>
                <h3>{symptom.title}</h3>
                <p className="symptom-description">{symptom.description}</p>
                <ul className="symptom-items">
                  {symptom.items.map((item, idx) => (
                    <li key={idx}>
                      <span className="bullet">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Recovery Section */}
        <section className="precautions-section">
          <div className="section-header">
            <h2>🏥 Treatment & Recovery</h2>
            <p>Guidelines for managing pneumonia treatment and recovery</p>
          </div>

          <div className="recovery-grid">
            {recovery.map((phase, index) => (
              <div key={index} className="recovery-card">
                <div className="recovery-icon">{phase.icon}</div>
                <h3>{phase.title}</h3>
                <ul className="recovery-tips">
                  {phase.tips.map((tip, idx) => (
                    <li key={idx}>
                      <span className="tip-dot"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="important-notes">
          <div className="note-card note-info">
            <h3>📌 Important Information</h3>
            <ul>
              <li>Pneumonia is a serious infection that requires proper medical attention</li>
              <li>Early diagnosis and treatment significantly improve outcomes</li>
              <li>Different types of pneumonia may require different treatment approaches</li>
              <li>Always consult with healthcare professionals for personalized advice</li>
              <li>Children, elderly, and immunocompromised individuals are at higher risk</li>
            </ul>
          </div>

          <div className="note-card note-warning">
            <h3>⚠️ When to Seek Help</h3>
            <p>Contact your healthcare provider immediately if you:</p>
            <ul>
              <li>Develop symptoms of pneumonia</li>
              <li>Have a weakened immune system and develop respiratory symptoms</li>
              <li>Are elderly or have chronic health conditions and develop respiratory symptoms</li>
              <li>Experience worsening symptoms despite treatment</li>
              <li>Have signs of serious complications</li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-card">
            <h2>Get Your X-Ray Analyzed Today</h2>
            <p>Use our AI-powered diagnostic tool to check your chest X-ray</p>
            <a href="/predict" className="cta-btn">
              Start Analysis
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Precautions;
