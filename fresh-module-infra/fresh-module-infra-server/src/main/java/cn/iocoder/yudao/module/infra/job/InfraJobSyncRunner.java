package cn.iocoder.yudao.module.infra.job;

import cn.iocoder.yudao.module.infra.service.job.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InfraJobSyncRunner implements ApplicationRunner {

    private final JobService jobService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        log.info("[run][开始同步当前服务可执行的 Quartz 任务]");
        jobService.syncJob();
        log.info("[run][同步当前服务可执行的 Quartz 任务完成]");
    }

}
