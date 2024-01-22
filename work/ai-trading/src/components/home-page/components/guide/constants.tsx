import { CREATA_AXI_ACCOUNT_LINK } from '@/constants/axi-link';
import style from './index.module.scss';

export const DATA_GUIDES = [
  {
    question: 'Làm thế nào để đăng ký gói Premium Package của 8xAITrading?',
    answer: (
      <div className={style.answerContainer}>
        Quý khách vui lòng đăng ký theo hướng dẫn tại LINK{' '}
        <a
          href="https://t.me/trading8x_signal/872"
          target="_blank"
          rel="noreferrer"
        >
          (https://t.me/trading8x_signal/872)
        </a>
      </div>
    ),
  },
  {
    question:
      'Làm thế nào để đăng nhập tài khoản vào trang Premium Package của 8xAITrading?',
    answer: (
      <div className={style.answerContainer}>
        <p>
          Để sử dụng dịch vụ của chúng tôi, quý khách vui lòng thực hiện các
          bước sau:
        </p>
        <ul className={style.ulContainer}>
          <li>
            <strong>Bước 1: Thanh toán</strong> <br /> Sau khi đã chọn sản phẩm
            và phương thức thanh toán phù hợp, quý khách vui lòng hoàn thành
            thanh toán theo hướng dẫn trên trang web.
          </li>
          <li>
            <strong>Bước 2: Nhắn tin cho admin</strong> <br />
            Sau khi hoàn thành thanh toán, quý khách vui lòng nhắn tin cho admin{' '}
            <a href="https://t.me/huyd002954" target="_blank" rel="noreferrer">
              https://t.me/huyd002954
            </a>{' '}
            cung cấp email cá nhân để chúng tôi có thể gửi thông tin đăng nhập
            về cho quý khách.
          </li>
          <li>
            <strong>Bước 3: Đăng nhập</strong> <br /> Sau khi nhận được tài
            khoản và mật khẩu từ hệ thống, quý khách vui lòng đăng nhập vào
            trang web bằng thông tin tài khoản và mật khẩu được cung cấp. Sau
            khi đăng nhập thành công, quý khách có thể sử dụng các dịch vụ của
            chúng tôi theo hướng dẫn trên trang web.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question:
      'Làm thế nào để sử dụng A.I Trading sau khi đã đăng nhập thành công?',
    answer: (
      <div className={style.answerContainer}>
        <p>Để sử dụng A.I Trading, quý khách có thể thực hiện các bước sau:</p>
        <ul className={style.ulContainer}>
          <li>
            <strong>
              Bước 1: Truy cập vào trang chủ của A.I Trading Premium
            </strong>{' '}
            <br /> Quý khách truy cập vào trang chủ của A.I Trading bằng đường
            link được cung cấp trên trang web hoặc tìm kiếm trên công cụ tìm
            kiếm.
          </li>
          <li>
            <strong>Bước 2: Xem chi tiết thông tin A.I Trading</strong>
            <br />
            Sau khi truy cập vào trang chủ của A.I Trading, quý khách vui lòng
            xem chi tiết các thông tin về A.I Trading được cung cấp trên trang
            web. Quý khách nên đọc kỹ thông tin về A.I Trading để hiểu rõ hơn về
            các thông số của dịch vụ này.
          </li>
          <li>
            <strong>Bước 3: Lựa chọn A.I Trading phù hợp</strong>
            <br />
            Sau khi đã hiểu rõ về thông tin của A.I Trading, quý khách có thể
            chọn một trong các con A.I Trading được cung cấp trên trang web mà
            phù hợp với nhu cầu và mong muốn của mình.
          </li>
          <li>
            <strong>Bước 4: Nhập ID MT4 và Password</strong>
            <br />
            Sau khi đã chọn được A.I Trading phù hợp, quý khách cần nhập ID MT4
            và password của mình để kết nối với hệ thống của A.I Trading. Tài
            khoản Axi MT4 của bạn phải được mở dưới link referral của 8xtrading
            hoặc tạo tài khoản Axi theo liên kết:{' '}
            <a href={CREATA_AXI_ACCOUNT_LINK} target="_blank" rel="noreferrer">
              {CREATA_AXI_ACCOUNT_LINK}
            </a>{' '}
            nếu chưa có tài khoản.
          </li>
          <li>
            <strong>Bước 5: Sử dụng dịch vụ </strong>
            <br />
            Sau khi đã kết nối thành công với hệ thống A.I Trading, quý khách có
            thể để A.I Trading làm các công việc của mình. Hệ thống sẽ thực hiện
            các giao dịch trên tài khoản MT4 của quý khách dựa trên các thuật
            toán và phân tích của A.I Trading.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Làm thế nào để thay đổi A.I Trading?',
    answer: (
      <div className={style.answerContainer}>
        <p>Để thay đổi A.I Trading, quý khách có thể thực hiện các bước sau:</p>
        <ul className={style.ulContainer}>
          <li>
            <strong>Bước 1: Ngắt kết nối với A.I Trading hiện tại</strong>
            <br /> Trước khi thay đổi A.I Trading, quý khách cần ngắt kết nối
            với A.I Trading hiện tại trên tài khoản MT4 của mình. Điều này giúp
            đảm bảo rằng không có xung đột nào xảy ra giữa các A.I Trading.
          </li>
          <li>
            <strong>Bước 2: Kết nối với A.I Trading mới</strong>
            <br />
            Sau khi đã ngắt kết nối với A.I Trading hiện tại, quý khách có thể
            kết nối với A.I Trading mới theo cách như khi sử dụng con mới. Quý
            khách cần nhập ID MT4 và Password của mình để kết nối với hệ thống
            của A.I Trading mới.
            <br />
            <strong>Lưu ý:</strong> Tài khoản Axi MT4 của bạn phải được mở dưới
            link referral của 8xtrading hoặc tạo tài khoản Axi theo liên kết{' '}
            <a href={CREATA_AXI_ACCOUNT_LINK} target="_blank" rel="noreferrer">
              {CREATA_AXI_ACCOUNT_LINK}
            </a>{' '}
            nếu chưa có tài khoản
          </li>
          <li>
            <strong>Bước 3: Sử dụng dịch vụ</strong>
            <br />
            Sau khi đã kết nối thành công với A.I Trading mới, quý khách có thể
            sử dụng dịch vụ của A.I Trading theo hướng dẫn trên trang web.
            <br />
            <strong>Lưu ý:</strong> Mỗi tài khoản MT4 chỉ có thể kết nối với một
            A.I Trading duy nhất. Không thể sử dụng song song hai A.I Trading
            trên cùng một tài khoản MT4.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Chính sách và điều khoản',
    answer: (
      <div className={style.answerContainer}>
        <p>
          Algo Trading là việc kết hợp các hệ thống giao dịch được kiểm chứng
          bởi các chuyên gia của 8xtrading và thuật toán của máy tính.
        </p>
        <p>
          <strong>Algo Trading cho phép:</strong>
        </p>
        <ul className={style.ulContainer}>
          <li>+ Hỗ trợ bao quát toàn bộ các cặp giao dịch trên thị trường.</li>
          <li>+ Mở vị thế ngay lập tức khi các thông số được đáp ứng.</li>
          <li>
            + Kỷ luật trong quản lý vốn, loại bỏ các yếu tố liên quan đến cảm
            xúc của con người.
          </li>
        </ul>
        <p>
          Tuy nhiên, đây vẫn được coi là một kênh đầu tư cực kỳ mạo hiểm, vì
          thế, để hạn chế các lỗi liên quan đến hệ thống và thuật toán. chúng
          tôi cần người dùng tuân thủ hoàn toàn các mục trong phần QUY TẮC SỬ
          DỤNG.
        </p>
        <p>
          <strong>QUY TẮC SỬ DỤNG:</strong>
        </p>
        <ul className={style.ulContainer}>
          <li>
            + BẮT BUỘC sử dụng tài khoản Axi Broker kích hoạt dưới link referral
            của 8xtrading.
          </li>
          <li>
            + KHÔNG ĐƯỢC THAO TÁC (Mở lệnh, đóng lệnh, cắt lỗ, chốt lời) trên
            tài khoản đang kích hoạt A.I Trading.
          </li>
          <li>
            + Nếu phát hiện có vi phạm vào điều khoản đang tiến hành A.I
            Trading, chúng tôi sẽ lập tức có các biện pháp cảnh báo:
            <br />
            Lần 1: Ngắt kết nối.
            <br />
            Lần 2: Ngắt kết nối và vô hiệu hoá kết nối trong 3 ngày. <br />
            Lần 3: Ngắt kết nối và Kết thúc dịch vụ.
          </li>
        </ul>
        <p>
          <i>Trường hợp kết nối lại sẽ tính như tài khoản bắt đầu mới.</i>
        </p>
        <p>
          <i>
            Lưu ý: Khi ngắt kết nối với A.I Trading, hệ thống sẽ tự động đóng
            tất cả các lệnh đang giao dịch của A.I Trading. Các lệnh được tự
            động mở do người dùng, hệ thống sẽ không can thiệp và trong giai
            đoạn ngắt kết nối, chúng tôi sẽ không chịu trách nhiệm về Max
            Drawdown của khách hàng.
          </i>
        </p>
        <p>
          <strong>CÁC TRƯỜNG HỢP SAU ĐÂY SẼ TÍNH LÀ VI PHẠM ĐIỀU KHOẢN:</strong>
        </p>
        <ul className={style.ulContainer}>
          <li>
            - Chủ động mở lệnh hoặc đóng lệnh trên sàn theo quan điểm và phân
            tích của bản thân người dùng.
          </li>
          <li>- Chủ động rút tiền khi chưa tới thời hạn rút tiền quy định.</li>
          <li>
            - Chủ động nạp thêm tiền khi chưa tới thời hạn thay đổi số vốn ban
            đầu.
          </li>
          <li>
            - Chủ động di dời điểm cắt lỗ (stoploss) và chốt lệnh (takeprofit)
            của giao dịch.
          </li>
          <li>- Chủ động tăng thêm volume giao dịch.</li>
        </ul>
        <p>
          <strong>DISCLAIMER:</strong>
        </p>
        <ul className={style.ulContainer}>
          <li>
            + Chúng tôi không bao giờ kêu gọi vốn cũng không sử dụng vốn của
            người dùng để đầu tư các hạng mục khác.
          </li>
          <li>
            + Chúng tôi không can thiệp các hoạt động nạp và rút tài sản của
            người dùng.
          </li>
          <li>
            + Chúng tôi không cam kết bất kỳ mức lợi nhuận nào với người dùng,
            mọi thông số về lợi nhuận của hệ thống đều là dự phóng và luôn tồn
            tại rủi ro.
          </li>
          <li>
            + Chúng tôi cam kết thông số về mức Max Drawdown được hiển thị trên
            từng chiến lược A.I Trading mà quý khách lựa chọn.
          </li>
          <li>
            + Bất cứ mức sụt giảm nào cao hơn mức Max Drawdown đã cam kết sẽ
            được hoàn lại phần tiền vi phạm cam kết.
          </li>
        </ul>
      </div>
    ),
  },
  {
    question: 'Hỗ trợ người dùng',
    answer: (
      <div className={style.answerContainer}>
        Nếu quý khách có bất kỳ thắc mắc hoặc vướng mắc nào, vui lòng liên hệ
        với admin{' '}
        <a href="https://t.me/HoangDang27" target={'_blank'} rel="noreferrer">
          https://t.me/HoangDang27
        </a>{' '}
        để được hỗ trợ kịp thời và chính xác nhất.
      </div>
    ),
  },
];
