router.get('/certificates/print/:id', async (req, res) => {
    const certificate = await Certificate.findById(req.params.id).populate('userId courseId');
    res.render('certificates/print', { certificate, user: certificate.userId, course: certificate.courseId });
  });