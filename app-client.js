// Deze functie haalt de taken die in firebase staan
const getTask = async () => {
  try {
    const response = await fetch(
      "https://wincacademydatabase.firebaseio.com/jelmer/tasks.json",
      { method: "GET" }
    );
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
