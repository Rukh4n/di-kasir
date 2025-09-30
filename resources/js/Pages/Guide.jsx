import React from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import Introduction from './GuideComponents/Introduction'
import LoginGuide from './GuideComponents/LoginGuide'
import PanelDashboard from './GuideComponents/PanelDashboard'
import PageCategories from './GuideComponents/PageCategories'
import PageProducts from './GuideComponents/PageProducts'
import PageTransaction from './GuideComponents/PageTransaction'
import PageOption from './GuideComponents/PageOption'
import PageProfile from './GuideComponents/PageProfile'
import { motion } from 'framer-motion'

const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

const Guide = () => {
  return (
    <GuestLayout>
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <Introduction />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <LoginGuide />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PanelDashboard />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PageCategories />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PageProducts />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PageTransaction />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PageOption />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariant}
      >
        <PageProfile />
      </motion.div>
    </GuestLayout>
  )
}

export default Guide
