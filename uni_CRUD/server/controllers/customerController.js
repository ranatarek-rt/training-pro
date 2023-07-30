const Student = require('../models/Student');
const mongoose = require('mongoose');


exports.homepage = async (req, res) => {
    const messages = req.flash('info'); // Retrieve flash messages using req.flash()
    const local = {
      title: "my page",
    };
  
    let perPage  = 12;
    let page = req.query.page || 1;
  
    try {
      const students = await Student.aggregate([{$sort:{updatedAt:-1}}])
        .skip(perPage * page-perPage)
        .limit(perPage)
        .exec();
      const count = await Student.count() ;
      res.render('index', { local,students,current:page,pages:Math.ceil(count/perPage),messages});
    } catch (error) {
      console.log(error);
    }
  
  };





// exports.homepage = async (req, res) => {
//   const messages = req.flash('info'); // Retrieve flash messages using req.flash()
//   const local = {
//     title: "my page",
//   };

//   let perPage  = 12;
//   let page = req.query.page || 1;

//   try {
//     const students = await Student.find({}).limit(20);
//     res.render('index', { local, messages, students });
//   } catch (error) {
//     console.log(error);
//   }

// };

//about  page 
exports.about = async (req, res) => {
  const messages = req.flash('info'); // Retrieve flash messages using req.flash()
  const local = {
    title: "about page",
  };
  try {
    res.render('about', { local});
  } catch (error) {
    console.log(error);
  }

};



exports.addCustomer = async (req, res) => {
  const local = {
    title: "student-page",
  };
  res.render('students/add', local);
};

exports.postStudent = async (req, res) => {
  console.log(req.body);

  const newStudent = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    detail: req.body.detail,
  });

  try {
    await newStudent.save();
    req.flash('info', 'New student added'); // Set flash message using req.flash()
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};


exports.view = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'view Student Data',
      };
      res.render('students/view', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};


exports.edit= async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id });
    if (!student) {
      console.log('Student not found'); // Add this line to check if student is null
      // Handle the case when student is null (e.g., render an error page)
    } else {
      const local = {
        title: 'Edit Student Data',
      };
      res.render('students/edit', { local, student });
    }
  } catch (error) {
    console.log(error); // Output the error for debugging purposes
  }
};



exports.editPost= async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id,{
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      tel:req.body.tel,
      details:req.body.details,
      email:req.body.email,
      updatedAt:Date.now(),

    });
    res.redirect(`/edit/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }
};


exports.deleteStudent= async (req, res) => {
  try {
    await Student.deleteOne({_id: req.params.id});
    res.redirect('/');

  } catch (error) {
    console.log(error);
  }
};


exports.searchStudents = async (req, res) => {
  const local = {
    title: "my page",
  };
  try {
    let searchTerm = req.body.searchTerm || req.session.searchTerm || '';
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const regex = new RegExp(searchNoSpecialChar, "i"); // "i" flag for case-insensitive search

    const students = await Student.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    });

    req.session.searchTerm = searchTerm; // Store the search term in the session

    if (students.length === 0) {
      // If no search results found, render a message in the view
      res.render("search", {
        students: [],
        local,
        message: "No results found.",
      });
    } else {
      // If search results are found, render the students in the view
      res.render("search", {
        students,
        local,
      });
    }
  } catch (error) {
    console.log(error); // Log the error for debugging purposes
    res.status(500).send("Internal Server Error"); // Send an appropriate error response
  }
};

