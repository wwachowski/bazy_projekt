export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string; // 'S' lub 'N' (Serwisowy / Normal)

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    user_type: string
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.user_type = user_type;
  }
}
