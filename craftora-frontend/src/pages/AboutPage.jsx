import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Globe, ShieldCheck, Users, ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

const TEAM = [
  {
    name: 'Arjun Mehta',
    role: 'Co-Founder & CEO',
    bio: 'Passionate about connecting artisans with global audiences through technology.',
    initials: 'AM',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Artisan Relations',
    bio: 'A craft enthusiast who has personally on-boarded over 200 artisans onto Craftora.',
    initials: 'PS',
    color: 'from-violet-400 to-purple-600',
  },
  {
    name: 'Rohan Das',
    role: 'Chief Technology Officer',
    bio: 'Building the infrastructure that lets handmade reach every corner of the world.',
    initials: 'RD',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    name: 'Sneha Iyer',
    role: 'Creative Director',
    bio: 'Curating aesthetics that celebrate the soul behind every handcrafted piece.',
    initials: 'SI',
    color: 'from-rose-400 to-pink-600',
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Crafted with Purpose',
    desc: 'Every product on Craftora carries the story of a maker — their culture, skill, and dedication.',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  {
    icon: Globe,
    title: 'Global Reach, Local Roots',
    desc: 'We bridge the gap between local artisan communities and customers across the world.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Authenticity Guaranteed',
    desc: 'Every seller is verified. Every product is handmade. No mass-produced counterfeits.',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-500/10',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'We invest a portion of every sale back into artisan training and craft preservation programs.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-500/10',
  },
];

const STATS = [
  { value: '10,000+', label: 'Artisans Empowered' },
  { value: '85+', label: 'Countries Reached' },
  { value: '500K+', label: 'Happy Customers' },
  { value: '2M+', label: 'Products Sold' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-yellow-400/10 dark:bg-yellow-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-violet-500/10 dark:bg-violet-600/5 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30 text-yellow-700 dark:text-yellow-400 text-sm font-semibold mb-6"
          >
            <Sparkles size={14} />
            Our Story
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
          >
            Handmade for a{' '}
            <span className="text-yellow-500">Better World</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Craftora was born from a simple belief — that handcrafted goods deserve a global stage,
            and the artisans behind them deserve fair recognition and earnings.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-yellow-500 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-500 mb-3 block">
              Our Mission
            </span>
            <h2 className="font-display text-4xl font-bold leading-tight mb-6">
              Empowering Artisans,<br />One Sale at a Time
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              We started Craftora in 2021 with just 12 artisans and a dream. Today, we host over
              10,000 makers from pottery villages in Rajasthan to textile weavers in Oaxaca —
              all united by their love of the craft.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our platform doesn't just sell products — it preserves traditions, sustains livelihoods,
              and connects conscious consumers with the real humans behind what they buy.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-8xl mb-4">🏺</div>
                <p className="text-xl font-display font-bold text-gray-700 dark:text-gray-300">
                  Handcrafted with Heart
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Every item tells a unique story
                </p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center text-xl">
                ✨
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900 dark:text-white">Est. 2021</p>
                <p className="text-xs text-gray-500">Bangalore, India</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-500 mb-3 block">
              What We Stand For
            </span>
            <h2 className="font-display text-4xl font-bold">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl ${val.bg} flex items-center justify-center mb-5`}>
                    <Icon size={22} className={val.color} />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-500 mb-3 block">
              The People Behind Craftora
            </span>
            <h2 className="font-display text-4xl font-bold">Meet the Team</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg`}>
                  {member.initials}
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 font-semibold uppercase tracking-wide mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gray-900 dark:bg-yellow-500 text-center p-16"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent dark:from-yellow-300/10 pointer-events-none" />
            <Sparkles size={36} className="text-yellow-400 dark:text-gray-900 mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold text-white dark:text-gray-900 mb-4">
              Ready to Discover Handcrafted?
            </h2>
            <p className="text-gray-400 dark:text-gray-700 mb-8 text-lg">
              Explore thousands of unique, artisan-made products crafted with love.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-yellow-500 dark:bg-gray-900 text-gray-900 dark:text-yellow-400 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-yellow-500/30 transition-all"
                >
                  Shop Now <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/artisans">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white/10 dark:bg-gray-900/10 text-white dark:text-gray-900 font-bold px-8 py-4 rounded-full border border-white/20 dark:border-gray-900/20 hover:bg-white/20 transition-all"
                >
                  Meet Artisans
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
