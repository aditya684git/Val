import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";
import FloatingHearts from "@/components/FloatingHearts";
import HeartBurst from "@/components/HeartBurst";

// Initialize EmailJS with your public key
emailjs.init("he85-60E3YagNmM80");

/* ── Customize your questions here ── */
type Question = 
  | { question: string; type: "choice"; options: string[] }
  | { question: string; type: "text" };

const questions: Question[] = [
  {
    question: "what do we love to eat on dates? 🍕",
    options: ["sushi", "pesto pasta", "garlic shrimp", "shawarma"],
    type: "choice",
  },
  {
    question: "Pick a dream future date 🌸",
    options: ["Beach Sunset", "clay/painting date", "Candlelight dinner at home (I cook)", "Movies + cuddles"],
    type: "choice",
  },
  {
    question: "Best date we've ever had? 🎶",
    options: ["Puri long drive", "Terra rosso", "Let's Talk", "cooking date(we made pesto pasta)"],
    type: "choice",
  },
  {
    question: "What's the thing you love most about 'us'?",
    type: "text",
  },
];

/* ── Customize the "No" button text sequence here ── */
// Sequence after each click on "No":
// 1) Are you sure?
// 2) Really??
// 3) Think again!
// 4) Please don’t say no…
const noTexts = [
  "No",
  "Are you sure?",
  "Really??",
  "Think again!",
  "Please don’t say no…",
];

/* ── Yes button scale progression (grows with each No click) ── */
// Scale after each "No" click:
// 1st: 1.2, 2nd: 1.5, 3rd: 2, 4th: ~4-5
const yesScales = [1, 1.2, 1.5, 2, 4.5];

type Screen = "landing" | "quiz" | "valentine" | "final";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [noIndex, setNoIndex] = useState(0);
  const [noStyle, setNoStyle] = useState<React.CSSProperties>({});
  const [yesScale, setYesScale] = useState(1);
  const [textAnswer, setTextAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState(false);

  const handleStart = () => setScreen("quiz");

  const handleNext = (selectedAnswer?: string) => {
    // Save the answer for this question
    const answerToSave = selectedAnswer || textAnswer;
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQ] = answerToSave;
      return newAnswers;
    });

    if (currentQ < questions.length - 1) {
      setTextAnswer(""); // Clear text input for next question
      setCurrentQ((p) => p + 1);
    } else {
      setScreen("valentine");
    }
  };

  const handleNo = useCallback(() => {
    // Track how many times "No" has been clicked (used for text + scaling)
    const nextNoIndex = Math.min(noIndex + 1, noTexts.length - 1);

    // Grow Yes button based on click count
    setYesScale(yesScales[Math.min(nextNoIndex, yesScales.length - 1)]);

    // Make "No" progressively smaller (after 4th click it becomes tiny)
    const noButtonScale = nextNoIndex >= 4 ? 0.18 : Math.max(0.35, 1 - nextNoIndex * 0.15);

    // Move "No" randomly within the upper playground area (above Yes button)
    const x = 5 + Math.random() * 70; // horizontal: 5% to 75%
    const y = 60 + Math.random() * 30; // vertical: 60% to 90% of upper area (below the text)

    setNoStyle({
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: `scale(${noButtonScale}) translate(-50%, -50%)`,
      transition: "transform 0.2s ease, left 0.2s ease, top 0.2s ease",
    });

    setNoIndex(nextNoIndex);
  }, [noIndex]);

  const handleYes = async () => {
    setScreen("final");
    
    // Send email with quiz results
    if (!emailSent) {
      try {
        console.log("Attempting to send email...");
        
        // Format the answers for the email
        const formattedAnswers = questions
          .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${answers[i] || "Not answered"}`)
          .join("\n\n");

        const templateParams = {
          quiz_responses: formattedAnswers,
          submission_date: new Date().toLocaleString(),
          to_name: "Valentine",
        };

        console.log("Sending with params:", templateParams);

        // Send email using EmailJS
        const result = await emailjs.send(
          "service_da4ogoo",
          "template_naygxrn",
          templateParams
        );

        setEmailSent(true);
        console.log("✅ Email sent successfully!", result);
      } catch (error) {
        console.error("❌ Failed to send email:", error);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQ(0);
    setNoIndex(0);
    setYesScale(1);
    setTextAnswer("");
    setNoStyle({});
    setAnswers([]);
    setEmailSent(false);
    setScreen("quiz");
  };

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const currentQuestion = questions[currentQ];

  const renderQuizContent = () => {
    if (currentQuestion.type === "choice") {
      return (
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleNext(opt)}
              className="w-full text-left bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground p-4 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              {opt}
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <div className="mb-8">
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type your answer here... 💭"
            className="w-full bg-secondary text-secondary-foreground p-4 rounded-xl font-medium border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none min-h-[120px]"
          />
          <button
            onClick={() => handleNext()}
            disabled={!textAnswer.trim()}
            className="w-full mt-4 bg-primary text-primary-foreground p-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Continue →
          </button>
        </div>
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {/* ── Landing Screen ── */}
        {screen === "landing" && (
          <motion.div
            key="landing"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="relative z-10 text-center"
          >
            <div className="text-7xl md:text-8xl mb-6 heartbeat">❤️</div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Take the Valentine Quiz
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              A little quiz for my favorite person 💞
            </p>
            <button
              onClick={handleStart}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Start ❤️
            </button>
          </motion.div>
        )}

        {/* ── Quiz Screen ── */}
        {screen === "quiz" && (
          <motion.div
            key={`q-${currentQ}`}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 border border-border">
              <div className="text-sm text-muted-foreground mb-2 font-semibold">
                Question {currentQ + 1} of {questions.length}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                {currentQuestion.question}
              </h2>
              
              {renderQuizContent()}

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i <= currentQ ? "bg-primary scale-110" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Valentine Question Screen ── */}
        {screen === "valentine" && (
          <motion.div
            key="valentine"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-lg"
          >
            <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 border border-border text-center relative overflow-hidden">
              {/* Upper area - No button playground (fixed height) */}
              <div className="relative min-h-[180px]">
                <div className="text-5xl mb-4 heartbeat">💘</div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Will you be my Valentine?
                </h2>
                {/* No button - moves randomly within this upper area only */}
                <button
                  onClick={handleNo}
                  style={noStyle}
                  className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:bg-muted"
                >
                  {noTexts[noIndex]}
                </button>
              </div>
              
              {/* Lower area - Yes button stays fixed here */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleYes}
                  style={{
                    transform: `scale(${yesScale})`,
                    transition: "transform 0.3s ease",
                  }}
                  className="bg-primary text-primary-foreground px-10 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow duration-300 origin-center"
                >
                  Yes! 💖
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Final Screen ── */}
        {screen === "final" && (
          <motion.div
            key="final"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center"
          >
            <HeartBurst />
            <div className="text-8xl md:text-9xl mb-6 heartbeat">❤️</div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Yay! You made my day ❤️
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              I'm the luckiest person in the world 💕
            </p>
            {/* ── Customize your closing message here ── */}
            <p className="text-lg text-muted-foreground mt-4 italic">
              "Every love story is beautiful, but ours is my favorite."
            </p>
            <button
              onClick={handleRetakeQuiz}
              className="mt-8 bg-secondary text-secondary-foreground px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Take Quiz Again 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
