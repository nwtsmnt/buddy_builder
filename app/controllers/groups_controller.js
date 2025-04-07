exports.renderGroups = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.render("groups", { error: "User not logged in." });
    }

    const groups = await db.query("SELECT * FROM Groups");
    res.render("groups", { groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.render("groups", { error: "An unexpected error occurred. Please try again." });
  }
};
