struct Movie {
    year: i16,
    title: String,
    age: i16,
}

impl Movie {
    fn print_movie_title(&self) -> String {
       self.title.clone()
    }

    fn print_movie_year(&self) -> i16{
        self.year
    }

    fn print_movie_age(&self) -> i16{
        self.age
    }
}

struct User {
    username: String,
    age: i16,
}

impl User {
    fn print_username(&self) {
        println!("{}", self.username);
    }
}

fn main() {
    let star_wars = Movie{year: 1977, title: String::from("Episode IV – A New Hope"), age:12};
    println!("The Movies Title: {:?}", star_wars.print_movie_title());
    println!("The Movies year: {:?}", star_wars.print_movie_year());
    println!("The Movies Minimum Age: {:?}", star_wars.print_movie_age());

    let user = User { username: String::from("Tissemand"), age: 0 };
    user.print_username();
}
