import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import Header from "../Header/Header.tsx";
import Footer from "../Footer/Footer.tsx";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store.ts";
import { getFAQThunk } from "../../core/users/users.thunk.ts";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-[70vw] overflow-hidden">
      <button
        className="w-full flex justify-between items-center cursor-pointer bg-dark-gray p-4 text-left text-lg font-medium "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-right">{question}</span>
        <FaChevronDown
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? contentRef.current?.scrollHeight : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          ref={contentRef}
          className="p-4 bg-bg-sidebar"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </motion.div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const dispatch = useAppDispatch();

  const { faqs } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(getFAQThunk());
  }, [dispatch]);

  return (
    <>
      <div className="relative pt-24 w-full min-h-[80vh] flex justify-center items-center bg-pattern">
        <Header />
        <div className=" mx-auto shadow-md rounded-lg overflow-hidden mb-24 mt-12">
          <h2 className="text-3xl font-bold mb-11">سوالات متداول</h2>
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
