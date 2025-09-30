import React from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import HeroSection from './WelcomeComponents/HeroSection'
import FeaturesSection from './WelcomeComponents/FeaturesSection'
import PricingSection from './WelcomeComponents/Pricingsection'
import FAQSection from './WelcomeComponents/FAQSection'
import CTASection from './WelcomeComponents/CTASection'
import { motion } from 'framer-motion'

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const Welcome = () => {
  return (
    <GuestLayout>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <HeroSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <FeaturesSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PricingSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <FAQSection />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <CTASection />
      </motion.div>
    </GuestLayout>
  )
}

export default Welcome
