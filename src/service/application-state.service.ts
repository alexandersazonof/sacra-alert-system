import { ApplicationStateEntity } from '../entity/application-state.entity';
import { AppDataSource } from '../data-source';

async function initDataSource() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export async function saveApplicationState(applicationState: ApplicationStateEntity): Promise<ApplicationStateEntity> {
  await initDataSource();
  const applicationStateRepository = AppDataSource.getRepository(ApplicationStateEntity);
  return await applicationStateRepository.save(applicationState);
}