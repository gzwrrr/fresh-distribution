package cn.iocoder.yudao.module.infra.service.job;

import cn.iocoder.yudao.framework.quartz.core.scheduler.SchedulerManager;
import cn.iocoder.yudao.framework.test.core.ut.BaseDbUnitTest;
import cn.iocoder.yudao.module.infra.controller.admin.job.vo.job.JobSaveReqVO;
import cn.iocoder.yudao.module.infra.dal.dataobject.job.JobDO;
import cn.iocoder.yudao.module.infra.dal.mysql.job.JobMapper;
import cn.iocoder.yudao.module.infra.enums.job.JobStatusEnum;
import cn.iocoder.yudao.framework.quartz.core.handler.JobHandler;
import org.junit.jupiter.api.Test;
import org.quartz.SchedulerException;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import javax.annotation.Resource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;

@Import({JobServiceImpl.class, JobServiceImplTest.TestConfiguration.class})
class JobServiceImplTest extends BaseDbUnitTest {

    @Resource
    private JobService jobService;

    @Resource
    private JobMapper jobMapper;

    @MockBean
    private SchedulerManager schedulerManager;

    @Test
    void testCreateJob_success() throws SchedulerException {
        JobSaveReqVO reqVO = new JobSaveReqVO();
        reqVO.setName("测试任务");
        reqVO.setHandlerName("demoJob");
        reqVO.setHandlerParam("fresh");
        reqVO.setCronExpression("0 0/5 * * * ?");
        reqVO.setRetryCount(1);
        reqVO.setRetryInterval(500);
        reqVO.setMonitorTimeout(0);

        Long jobId = jobService.createJob(reqVO);

        JobDO job = jobMapper.selectById(jobId);
        assertNotNull(job);
        assertEquals(JobStatusEnum.NORMAL.getStatus(), job.getStatus());
        assertEquals("demoJob", job.getHandlerName());
        verify(schedulerManager).addJob(jobId, "demoJob", "fresh", "0 0/5 * * * ?", 1, 500);
    }

    @Configuration
    static class TestConfiguration {

        @Bean("demoJob")
        JobHandler demoJobHandler() {
            return param -> "ok";
        }
    }
}
