"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showAttention, setShowAttention] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAttention(true);
      setTimeout(() => setShowAttention(false), 1500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-3 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 text-yellow-300 opacity-20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, "-100%"],
              rotate: 360,
              transition: {
                duration: Math.random() * 15 + 15,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
          >
            <Star />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div
          className="mb-3 p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg"
          animate={{
            scale: showAttention ? [1, 1.1, 1] : 1,
            boxShadow: showAttention
              ? "0 0 60px rgba(249, 115, 22, 0.8)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.5 }}
        >
          <Gift size={50} className="text-white" />
        </motion.div>

        <motion.h1
          className="gradient-text text-2xl sm:text-3xl font-extrabold mb-2"
          animate={{
            scale: showAttention ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          GANHE UM BRINDE!
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-base mb-3 text-gray-700 max-w-md font-medium">
            Responda nosso questionário rápido e retire seu brinde exclusivo!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="text-base px-6 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            COMEÇAR AGORA
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating element */}
      <motion.div
        className="absolute bottom-4 right-4 bg-orange-500 text-white p-1.5 rounded-full shadow-lg"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      >
        <Gift size={16} />
      </motion.div>
    </div>
  );
}
