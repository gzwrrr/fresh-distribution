package cn.iocoder.yudao.module.infra.job;

import cn.iocoder.yudao.module.infra.service.job.JobService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class InfraJobSyncRunnerTest {

    @Mock
    private JobService jobService;

    @InjectMocks
    private InfraJobSyncRunner runner;

    @Test
    void run_syncsLocalJobsIntoQuartz() throws Exception {
        runner.run(null);

        verify(jobService).syncJob();
    }

}
