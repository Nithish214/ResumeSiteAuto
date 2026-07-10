import { motion } from "framer-motion";

/**
 * Reusable scroll-reveal wrapper built on framer-motion. Replaces the old
 * IntersectionObserver-based useReveal hook + ".reveal" CSS class with
 * framer-motion's whileInView, which gives nicer spring/ease-based motion
 * and, importantly, staggered children essentially for free.
 *
 * Basic usage (fades + slides up once, when scrolled into view):
 *   <Reveal>{content}</Reveal>
 *   <Reveal delay={0.15}>{content}</Reveal>
 *
 * Staggered list usage - each Reveal.Item animates in slightly after the
 * previous one:
 *   <Reveal stagger>
 *     <Reveal.Item>{first}</Reveal.Item>
 *     <Reveal.Item>{second}</Reveal.Item>
 *   </Reveal>
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  stagger = false,
  as = "div",
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;

  if (stagger) {
    return (
      <MotionTag
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

Reveal.Item = function RevealItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
};
