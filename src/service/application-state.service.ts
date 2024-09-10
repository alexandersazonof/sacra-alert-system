import { ApplicationStateEntity } from '../entity/application-state.entity';
import { DataSource, Repository } from 'typeorm';

export class ApplicationStateService {

  private applicationStateRepository: Repository<ApplicationStateEntity>;

  constructor(dataSources: DataSource) {
    this.applicationStateRepository = dataSources.getRepository(ApplicationStateEntity);
  }

  async create(applicationName: string, status: string): Promise<ApplicationStateEntity> {
    const applicationState = new ApplicationStateEntity();
    applicationState.applicationName = applicationName;
    applicationState.status = status;
    return this.applicationStateRepository.save(applicationState);
  }

  async findAll(): Promise<ApplicationStateEntity[]> {
    return this.applicationStateRepository.find();
  }
}