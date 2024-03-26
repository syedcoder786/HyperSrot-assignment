import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center w-4/5 mx-auto py-8">
      <h1 className="text-3xl font-bold">Task Board</h1>
      <img
        src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
        alt=""
        className="w-16"
      />
    </nav>
  );
};

export default Navbar;
