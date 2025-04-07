exports.renderIntro = (req, res) => {
  try {
    const error = req.query.error || null; // Pass error from query params if any
    res.render("intro", { error });
  } catch (error) {
    console.error("Intro Page Error:", error);
    res.render("intro", { error: "An unexpected error occurred. Please try again." });
  }
};
