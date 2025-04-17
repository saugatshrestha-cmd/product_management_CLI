import { FileService } from '../../utils/fileHelper';
import FILE_PATHS from '../../constants/filePaths';
import { User } from '../../types/userTypes';

export class UserRepository {
  private fileService: FileService;
  private users: User[];

  constructor() {
    this.fileService = new FileService(FILE_PATHS.USERS);
    this.users = this.fileService.load();
  }

  private getNewId(): number {
    return this.users.length ? this.users[this.users.length - 1].id + 1 : 1;
  }

  public saveUsers(): void {
    this.fileService.save({ data: this.users });
  }

  getAll(): User[] {
    return this.users;
  }

  addUser(userData: Omit<User, 'id'>): void {
    const newUser: User = {
      id: this.getNewId(),
      ...userData,
    };
    this.users.push(newUser);
    this.saveUsers();
  }

  deleteUserById(userId: number): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== userId);
    this.saveUsers();
    return initialLength !== this.users.length;
  }
}
