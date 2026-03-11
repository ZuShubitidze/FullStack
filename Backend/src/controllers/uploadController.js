const upload = async (req, res) => {
  res.status(200).json({ message: "Upload Route Works" });
  console.log("Upload Route Works");
};

export { upload };
