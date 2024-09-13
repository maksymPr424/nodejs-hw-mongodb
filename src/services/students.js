import { ContactsCollection } from '../db/models/student.js';

export const getAllContacts = async () => {
  const students = await ContactsCollection.find();
  console.log(students);

  return students;
};

export const getContactById = async (studentId) => {
  const student = await ContactsCollection.findById(studentId);
  return student;
};
