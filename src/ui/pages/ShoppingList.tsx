import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ExportButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 179, 217, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ClearButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 2px 8px rgba(255, 179, 217, 0.1);
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ItemName = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  min-width: 200px;
`;

const QuantityInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  width: 120px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Unit = styled.span`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 80px;
`;

const UpdateButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ff6b6b;
    color: white;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  margin: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.buttonBg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const ExportTextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
    "Courier New", monospace;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  resize: vertical;
  line-height: 1.6;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ModalFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const CopyButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.buttonBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

interface ShoppingListItem {
  id: number;
  ingredient_id: number | null;
  ingredient_name: string;
  ingredient_unit: string;
  quantity: string;
  user_id: number;
  created_at: string;
}

export const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuantities, setEditingQuantities] = useState<
    Record<number, string>
  >({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportText, setExportText] = useState("");

  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.shoppingList.getAll();
      if (result.success && result.items) {
        setItems(result.items);
      }
    } catch (err) {
      console.error("Error loading shopping list:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    setEditingQuantities({
      ...editingQuantities,
      [itemId]: value,
    });
  };

  const handleUpdateQuantity = async (itemId: number) => {
    const newQuantity = editingQuantities[itemId];
    if (!newQuantity || !newQuantity.trim()) {
      alert("Quantity cannot be empty");
      return;
    }

    try {
      const result = await window.electronAPI.shoppingList.update(
        itemId,
        newQuantity
      );
      if (result.success) {
        await loadShoppingList();
        const { [itemId]: _, ...rest } = editingQuantities;
        setEditingQuantities(rest);
      } else {
        alert(result.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("An error occurred while updating quantity");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Remove this item from shopping list?")) {
      return;
    }

    try {
      const result = await window.electronAPI.shoppingList.delete(itemId);
      if (result.success) {
        await loadShoppingList();
      } else {
        alert(result.message || "Failed to delete item");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("An error occurred while deleting item");
    }
  };

  const handleClearList = async () => {
    if (!confirm("Are you sure you want to clear the entire shopping list?")) {
      return;
    }

    try {
      const result = await window.electronAPI.shoppingList.clear();
      if (result.success) {
        await loadShoppingList();
      } else {
        alert(result.message || "Failed to clear shopping list");
      }
    } catch (err) {
      console.error("Error clearing shopping list:", err);
      alert("An error occurred while clearing shopping list");
    }
  };

  const handleExport = () => {
    const bulletList = items
      .map(
        (item) =>
          `• ${item.quantity} ${item.ingredient_unit} ${item.ingredient_name}`
      )
      .join("\n");
    setExportText(bulletList);
    setIsExportModalOpen(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      alert("Shopping list copied to clipboard!");
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      alert("Failed to copy to clipboard");
    }
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
    setExportText("");
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState>Loading shopping list...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Shopping List</Title>
        {items.length > 0 && (
          <ButtonGroup>
            <ExportButton onClick={handleExport}>Export List</ExportButton>
            <ClearButton onClick={handleClearList}>Clear All</ClearButton>
          </ButtonGroup>
        )}
      </Header>

      {items.length === 0 ? (
        <EmptyState>
          <EmptyText>Your shopping list is empty</EmptyText>
          <EmptyText style={{ fontSize: "1rem", marginTop: "0.5rem" }}>
            Select recipes and add their ingredients to get started!
          </EmptyText>
        </EmptyState>
      ) : (
        <ItemsList>
          {items.map((item) => (
            <ItemCard key={item.id}>
              <ItemInfo>
                <ItemName>{item.ingredient_name}</ItemName>
                <QuantityInput
                  type="text"
                  value={editingQuantities[item.id] ?? item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  placeholder="Quantity"
                />
                <Unit>{item.ingredient_unit}</Unit>
              </ItemInfo>
              <ItemButtonGroup>
                {editingQuantities[item.id] !== undefined && (
                  <UpdateButton onClick={() => handleUpdateQuantity(item.id)}>
                    Update
                  </UpdateButton>
                )}
                <DeleteButton onClick={() => handleDeleteItem(item.id)}>
                  Remove
                </DeleteButton>
              </ItemButtonGroup>
            </ItemCard>
          ))}
        </ItemsList>
      )}

      {isExportModalOpen && (
        <ModalOverlay onClick={handleCloseExportModal}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Export Shopping List</ModalTitle>
              <CloseButton onClick={handleCloseExportModal}>
                &times;
              </CloseButton>
            </ModalHeader>
            <ModalContent>
              <ExportTextArea
                value={exportText}
                readOnly
                placeholder="Your shopping list will appear here..."
              />
            </ModalContent>
            <ModalFooter>
              <CancelButton onClick={handleCloseExportModal}>
                Close
              </CancelButton>
              <CopyButton onClick={handleCopyToClipboard}>
                Copy to Clipboard
              </CopyButton>
            </ModalFooter>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};
