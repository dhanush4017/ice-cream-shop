import PageBanner from '../components/PageBanner.jsx'
import Newsletter from '../components/Newsletter.jsx'

const STATS = [
  { number: '91%', label: 'Awards Won' },
  { number: '95%', label: 'Satisfied Clients' },
  { number: '48+', label: 'Special Employees' },
  { number: '143+', label: 'Successful Painting' },
]

const TEAM = [
  { name: 'Marvin Joner', role: 'Bakery Worker', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Patricia Woodrum', role: 'Staff Worker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Hannaz Stone', role: 'Shop Worker', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80&sat=-30' },
  { name: 'Elina James', role: 'Bakery Worker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80&sat=-10' },
  { name: 'Kevin Andrew', role: 'Staff Worker', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Lauren Trout', role: 'Shop Worker', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80&blend=fff' },
]

export default function About() {
  return (
    <>
      <PageBanner title="About Us" crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} />

      <section className="section">
        <div className="container">
          <div className="about-row">
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=500&h=500&q=80"
              alt="Team member enjoying ice cream"
            />
            <div>
              <h2>
                Our <span className="accent">Journey</span> Began With a Simple Dream
              </h2>
              <p style={{ marginBottom: 18 }}>
                Our goal is to make the sweetest ice cream using only the finest, natural
                ingredients. From milk, cream and gelato to authentic flavor combinations, every
                flavor is highly crafted to deliver the perfect treat.
              </p>
              <button className="btn btn-primary">Read More →</button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-row reverse">
            <div>
              <h2>Our Mission is to Create Moments</h2>
              <p style={{ marginBottom: 18 }}>
                We believe in taking every day and joyful memories in a warm expression of all-age
                joy, either celebrate, and manufacturing moments for you. Our sweet treats are
                focused on serving great moments.
              </p>
              <button className="btn btn-primary">Read More →</button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=500&h=380&q=80"
              alt="Friends sharing ice cream cones"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>
              Our <span className="accent">Statistics</span>
            </h2>
            <p>What makes our special fitting is our impressive statistics.</p>
          </div>
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="number">{s.number}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-bg-soft)' }}>
        <div className="container">
          <div className="section-heading">
            <h2>
              Our <span className="accent">Team</span> Members
            </h2>
            <p>Get to know the friendly faces behind your favorite flavors.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="team-card">
                <img src={member.avatar} alt={member.name} />
                <div className="name">{member.name}</div>
                <div className="role">{member.role}</div>
                <div className="socials">
                  <a href="#" aria-label="Facebook">f</a>
                  <a href="#" aria-label="Instagram">ig</a>
                  <a href="#" aria-label="YouTube">yt</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
