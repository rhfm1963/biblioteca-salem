const Payment = require('../models/Payment');
const User = require('../models/User');
const Course = require('../models/Course');

const createPayment = async (req, res) => {
  const { userId, courseId, amount } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'Usuario o curso no encontrado' });
    }

    const payment = new Payment({
      user: userId,
      course: courseId,
      amount: amount,
      status: 'completed',
    });

    await payment.save();

    user.payments.push(payment._id);
    course.payments.push(payment._id);

    await user.save();
    await course.save();

    res.status(201).json({ message: 'Pago creado exitosamente', payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Agrega estas funciones que faltaban

const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.params.userId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaymentsByCourse = async (req, res) => {
  try {
    const payments = await Payment.find({ course: req.params.courseId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, getPaymentsByUser, getPaymentsByCourse };
